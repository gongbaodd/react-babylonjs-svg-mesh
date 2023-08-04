import { Mesh, VertexData, Buffer, Engine, ShaderMaterial } from "@babylonjs/core"
import { useMemo, useRef, useState } from "react"
import svgMesh3d from "svg-mesh-3d"
import triagnleCentroid from "triangle-centroid"
import randomVec from "gl-vec3/random"
import { useClick, useEngine, useHover } from "react-babylonjs"
import reindex from "mesh-reindex"
import unindex from "unindex-mesh"
import vertexSource from "../assets/crash.vert?raw"
import fragmentSource from "../assets/blue.frag?raw"


function Crash(props: { svg: string }) {
    const engine = useEngine()
    const ref = useRef<Mesh>(null)
    const offset = useRef(0.)
    const [mat, setMat] = useState<ShaderMaterial|null>()
    
    const mesh = useMemo(() => {
        if (!engine) return null

        const path = getPath(props.svg)
        if (!path) return null

        const meshData = reindex(unindex(svgMesh3d(path)))
        const vertexData = makeVertex(meshData.positions, meshData.cells)
        const { centroidBuffer, directionBuffer } = getShaderAttr(meshData.positions, meshData.cells, engine)

        const mesh = new Mesh("simplicial-complex")

        vertexData.applyToMesh(mesh)
        mesh.setVerticesBuffer(centroidBuffer)
        mesh.setVerticesBuffer(directionBuffer)

        return mesh
    }, [engine, props.svg])

    useClick(() => {
        mat?.setFloat("offset", 1)
    }, ref)

    useHover(
        () => {
            mat?.setFloat("offset", .01)
        }, 
        () => {
            mat?.setFloat("offset", 0.)
        }
    , ref)

    return (
        <abstractMesh name="simplicial-complex" fromInstance={mesh} disposeInstanceOnUnmount ref={ref}>
            <shaderMaterial name="sc-material"
                shaderPath={{
                    vertexSource, fragmentSource
                }}
                backFaceCulling={false}
                options={{
                    attributes: ["position", "direction", "projection", "view", "center"],
                    uniforms: ["worldViewProjection", "offset"]
                }}
                ref={setMat}
            />
        </abstractMesh>
    )
}

export default Crash

function getPath(svg: string) {
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svg, "image/svg+xml")
    return svgDoc.querySelector("path")?.getAttribute("d") ?? null
}

function makeVertex(pos: number[][], cell: number[][]) {
    const positions = pos.flat()
    const indices = cell.flat()
    const vertexData = new VertexData()

    vertexData.positions = positions
    vertexData.indices = indices

    return vertexData
}

function getShaderAttr(pos: number[][], cells: number[][], engine: Engine) {
    const centroid: number[] = []
    const directions: number[] = []

    cells.forEach(([p1, p2, p3]) => {
        const triangle = [pos[p1], pos[p2], pos[p3]]
        const [cx, cy, cz] = triagnleCentroid(triangle)
        const [rx, ry, rz] = randomVec([], Math.random())

        for (let i = 0; i < 3; i++) {
            centroid.push(cx, cy, cz)
            directions.push(rx, ry, rz)
        }
    })

    const _centroidBuffer = new Buffer(engine, centroid, false, 3)
    const centroidBuffer = _centroidBuffer.createVertexBuffer("center", 0, 3)

    const _directionBuffer = new Buffer(engine, directions, false, 3)
    const directionBuffer = _directionBuffer.createVertexBuffer("direction", 0, 3)

    return { centroidBuffer, directionBuffer }
}

