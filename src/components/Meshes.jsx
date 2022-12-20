import React, { Component, useRef } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { colorArray } from "../helper/data";

class Block extends Component {
  constructor(
    color,
    position,
    RigidBodyType,
    scale = [20, 0.2, 20],
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

  createFloor() {
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

  createBrick(
    size,
    position,
    rotation = [0, 0, 0],
    collider = [0.25, 0.5, 0.25],
    mass
  ) {
    return (
      <RigidBody
        type="static"
        restitution={0}
        friction={0}
        colliders={false}
        gravityScale={0.2}
      >
        <mesh position={position} rotation={rotation}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={colorArray[Math.floor(Math.random() * colorArray.length)]}
          />
        </mesh>
        {/* collider size should be half of mesh scale */}
        <CuboidCollider
          args={[size[0] / 2, size[1] / 2, size[2] / 2]}
          mass={mass}
          position={position}
        />
      </RigidBody>
    );
  }
}

const Blocks = new Block();

const Floor = () => {
  const Floor = Blocks.createFloor();
  return Floor;
};

const Brick = ({ size, pos, rot, col, mass }) => {
  const pillar = Blocks.createBrick(size, pos, rot, col, mass);
  return pillar;
};

const Meshes = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((el, idx) => {
        return <Brick size={[0.5, 1, 0.5]} pos={[idx, 1, 0]} mass={1} />;
      })}
      {Array.from({ length: 2 }).map((el, idx) => {
        return <Brick size={[0.5, 1, 0.5]} pos={[idx, 1, -1]} mass={1} />;
      })}

      {<Brick size={[2.5, 0.2, 2.5]} pos={[0.5, 1.5, 0]} mass={10} />}

      {Array.from({ length: 2 }).map((el, idx) => {
        return <Brick size={[0.5, 1, 0.5]} pos={[idx, 2.5, 0]} mass={1} />;
      })}

      {<Brick size={[2.5, 0.2, 2.5]} pos={[0.5, 2.8, 0]} mass={10} />}

      {/* <Brick size={[2, 0.5, 2]} pos={[1.5, 1.5, 0]} mass={10} />
      {Array.from({ length: 2 }).map((el, idx) => {
        return <Brick size={[0.5, 1, 0.5]} pos={[idx + 1, 2.5, 0]} mass={1} />;
      })}
      <Brick size={[1.5, 0.5, 2]} pos={[1.5, 3, 0]} mass={10} />
      {Array.from({ length: 2 }).map((el, idx) => {
        return <Brick size={[0.5, 1, 0.5]} pos={[idx + 1, 3.5, 0]} mass={1} />;
      })}
      <Brick size={[0.5, 1, 0.5]} pos={[1, 3.5, 0.5]} mass={1} />; */}
      <Floor />
    </>
  );
};

export default Meshes;
