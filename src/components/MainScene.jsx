import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import SubScene from "./SubScene.jsx";
import { Physics, Debug } from "@react-three/rapier";

export default function MainScene() {
  return (
    <>
      <Physics>
        <Debug />
        <SubScene />
      </Physics>
      <OrbitControls makeDefault />
      <Lights />
    </>
  );
}
