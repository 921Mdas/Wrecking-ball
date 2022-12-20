import React, { Component, useRef } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { colorArray } from "../helper/data";
import Player from "./Player";
import Meshes from "./Meshes";

function SubScene() {
  return (
    <>
      <Meshes />
      <Player />
    </>
  );
}

export default SubScene;
