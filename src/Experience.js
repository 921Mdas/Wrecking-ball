import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.js";
import Level from "./Level.js";
import GameEnv from "./Blocks.js";
import { Physics, Debug } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect } from "react";

export default function Experience() {
  return (
    <>
      <Physics>
        <Debug />
        {/* <Level /> */}
        <GameEnv />
      </Physics>
      <OrbitControls makeDefault />
      <Lights />
    </>
  );
}
