import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/MainScene.jsx";
import { KeyboardControls } from "@react-three/drei";
import React, { useMemo } from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <KeyboardControls
    map={[
      { name: "forward", keys: ["ArrowUp", "KeyW", "W", "w"] },
      { name: "backward", keys: ["ArrowDown", "KeyS", "S", "s"] },
      { name: "leftward", keys: ["ArrowLeft", "KeyA", "A", "a"] },
      { name: "rightward", keys: ["ArrowRight", "KeyD", "D", "d"] },
      { name: "jump", keys: ["Space"] },
    ]}
  >
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [2.5, 4, 6],
      }}
    >
      <Experience />
    </Canvas>
  </KeyboardControls>
);
