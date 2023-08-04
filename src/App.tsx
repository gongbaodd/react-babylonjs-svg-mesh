import { Color4, Vector3 } from "@babylonjs/core";
import { Engine, Scene } from "react-babylonjs";
import twitterIcon from "./assets/twitter.svg?raw";
import Crash from "./Components/Crash";


function App() {
  return (
    <Engine
      antialias
      adaptToDeviceRatio
      canvasId="sample-canvas"
    >
      <Scene
        onSceneMount={({ scene }) => {
          scene.clearColor = new Color4(0, 0, 0, 0)
        }}
      >
        <arcRotateCamera
          name="camera1"
          target={new Vector3(0, 0, 0)}
          position={new Vector3(0, 0, -10)}
          alpha={-Math.PI / 2}
          beta={Math.PI / 4}
          radius={15}
        />
        <Crash svg={twitterIcon} />
        <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
      </Scene>
    </Engine>
  );
}

export default App;
