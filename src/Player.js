import React, { useEffect, useRef, useState } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Vector3 } from "three";

const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const ref = useRef();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const jump = () => {
    const origin = ref.current?.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: 0.5, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) {
      ref.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
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
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    ref.current?.applyImpulse(impulse);
    ref.current?.applyTorqueImpulse(torque);

    // camera animation
    const bodyPosition = ref.current.translation();
    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 0.5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 0.5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <>
      <RigidBody
        position={[0, 1, 0]}
        colliders="ball"
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={0.5}
        friction={1}
        ref={ref}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Player;
