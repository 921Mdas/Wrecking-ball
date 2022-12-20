import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRapier } from "@react-three/rapier";

const Player = () => {
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

    cameraPosition.z += 10;
    cameraPosition.y += 5;

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
      <RigidBody type="static" position={[0, 1, 8]} colliders="hull" ref={ball}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            flatShading
            color={"red"}
            metalness={0.4}
            roughness={0}
          />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Player;
