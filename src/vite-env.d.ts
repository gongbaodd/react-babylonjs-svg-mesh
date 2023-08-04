/// <reference types="vite/client" />

declare module 'svg-mesh-3d' {
    export default function (svg: string, opt?: any): {
        cells: number[][],
        positions: number[][],
    };
}

declare module "triangle-centroid" {
    export default function (tri: number[][]): number[];
}

declare module "mesh-reindex" {
    export default function (array: number[]): {
        cells: number[][],
        positions: number[][],
    };
}

declare module "unindex-mesh" {
    export default function (positions: number[][], cells: number[][], out?: number[][]): number[];
    export default function (positions: {
        cells: number[][],
        positions: number[][],
    }, cells?: number[][], out?: number[][]): number[];
}
