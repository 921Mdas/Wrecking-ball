import React, { Component, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { colorArray } from "./helper/data";
import Curve from "./components/Curve";
import { useKeyboardControls } from "@react-three/drei";
import { useRapier } from "@react-three/rapier";

// space between blocks
const sBB = 8;

class Block extends Component {
  constructor(
    color,
    position,
    RigidBodyType,
    scale = [8, 0.2, 5],
    rotation = [0, 0, 0]
  ) {
    super();
    this.color = color;
    this.position = position;
    this.RigidBodyType = RigidBodyType;
    this.scale = scale;
    this.rotation = rotation;
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
      flatShading: true,
    });
  }

  buildBlock() {
    return (
      <RigidBody type="fixed">
        <mesh
          material={this.material}
          position={this.position}
          color={this.color}
        >
          <boxGeometry args={this.scale} />
        </mesh>
      </RigidBody>
    );
  }
}

function GameEnv() {
  const ref = useRef();
  const ball = useRef();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );

  const jump = () => {
    const origin = ball.current?.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: 0.5, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.05) {
      console.log(hit.toi, hit.toi < 0.15);
      ball.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      state => state.jump,
      value => {
        if (value) {
          jump();
        }
      }
    );
    return () => {
      unsubscribeJump();
    };
  }, []);

  useFrame((state, delta) => {
    const keys = getKeys();
    const { forward, backward, leftward, rightward } = keys;
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    ball.current?.applyImpulse(impulse);
    ball.current?.applyTorqueImpulse(torque);

    const elPosition = ball.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(elPosition);

    cameraPosition.z += 4;
    cameraPosition.y += 1;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(elPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 0.5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 0.5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(cameraTarget);
  });

  return (
    <>
      <RigidBody type="static" position={[0, 1, 0]} colliders="hull" ref={ball}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"red"} />
        </mesh>
      </RigidBody>
      {Array.from({ length: 3 }).map((n, idx) => {
        const Blocks = new Block(colorArray[idx + 9], [0, 0, idx * -sBB]);
        return Blocks.buildBlock();
      })}
    </>
  );
}

export default GameEnv;

//  CreateBox(
//     definedPosition,
//     definedFriction,
//     definedRestitution,
//     definedRigidType
//   ) {
//     return (
//       <RigidBody
//         type="static"
//         friction={definedFriction ? definedFriction : this.friction}
//         restitution={definedRestitution ? definedRestitution : this.restitution}
//         ref={this.myRef}
//       >
//         <mesh
//           position={definedPosition ? definedPosition : this.position}
//           material={this.material}
//           color={this.color}
//           rotation={this.rotation}
//         >
//           <boxGeometry args={this.scale} />
//         </mesh>
//       </RigidBody>
//     );
//   }

//   Plane(
//     definedPosition,
//     definedFriction,
//     definedRestitution,
//     definedRigidType,
//     definedColor
//   ) {
//     return (
//       <RigidBody
//         type="fixed"
//         friction={definedFriction ? definedFriction : this.friction}
//         restitution={definedRestitution ? definedRestitution : this.restitution}
//       >
//         <mesh
//           position={definedPosition ? definedPosition : this.position}
//           material={this.material}
//           color={definedColor ? definedColor : this.color}
//           rotation={this.rotation}
//         >
//           <boxGeometry args={this.scale} />
//         </mesh>
//       </RigidBody>
//     );
//   }

{
  /* {Blocks.buildBlock()} */
}
{
  /* <RigidBody
        type="static"
        friction={0}
        restitution={0.4}
        ref={ref}
        colliders="hull"
      >
        <mesh
          position={[0, 0.5, 0]}
          onClick={e => {
            console.log(ref.current);
            ref.current?.applyImpulse(impulse);
          }}
        >
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"red"} />
        </mesh>
      </RigidBody> */
}
