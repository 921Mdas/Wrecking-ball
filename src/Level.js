import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import Player from "./Player";
import { useKeyboardControls } from "@react-three/drei";

const floorCol = "limegreen";
const floor2ndCol = "greenyellow";
const obstacleCol = "orangered";
const wallCol = "stategrey";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const StMaterial = props => {
  return <meshStandardMaterial {...props} />;
};

const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      >
        <StMaterial color={floorCol} />
      </mesh>
    </group>
  );
};
const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [speed] = useState(
    Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame(state => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });

  useEffect(() => {
    console.log(obstacle);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      >
        <StMaterial color={floor2ndCol} />
      </mesh>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.2, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh geometry={boxGeometry} scale={[4, 0.3, 0.4]}>
          <StMaterial color={obstacleCol} />
        </mesh>
      </RigidBody>
    </group>
  );
};
const BlockLeveler = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [speed] = useState(
    Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame(state => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time) + 1.2;
    // moving onstacles after creating them can cause problems
    // solution is to provide the solution in the way we just did
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      >
        <StMaterial color={floor2ndCol} />
      </mesh>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.2, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh geometry={boxGeometry} scale={[4, 0.3, 0.4]}>
          <StMaterial color={obstacleCol} />
        </mesh>
      </RigidBody>
    </group>
  );
};
const BlockAxe = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [speed] = useState(
    Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame(state => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time);
    // moving onstacles after creating them can cause problems
    // solution is to provide the solution in the way we just did
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1],
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      >
        <StMaterial color={floor2ndCol} />
      </mesh>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.2, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh geometry={boxGeometry} scale={[2, 1, 0.4]} position={[0, 0.5, 0]}>
          <StMaterial color={obstacleCol} />
        </mesh>
      </RigidBody>
    </group>
  );
};

const BlockEnd = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      >
        <StMaterial color={floorCol} />
      </mesh>
    </group>
  );
};

const Level = () => {
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      <BlockSpinner position={[0, 0, -4]} />
      <BlockLeveler position={[0, 0, -8]} />
      <BlockAxe position={[0, 0, -12]} />
      <BlockStart position={[0, 0, -16]} />
      <Player />
      {/* need lots of friction on the floor */}
      <CuboidCollider
        args={[2, 0.1, 8]}
        position={[0, -0.1, -6]}
        restitution={0.2}
        friction={1}
      />
    </>
  );
};

export default Level;
