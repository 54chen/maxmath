import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import Hammer from "./Hammer";
import Axe from "./Axe";
import { GameProgress } from "../store/types";
import { setGameProgress } from "../store/actions";
import store from "../store/store";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

interface PlayerProps {
  lerp?: (x: number, y: number, alpha: number) => number;
}

export function Player({ lerp = THREE.MathUtils.lerp }: PlayerProps) {
  const weapon = useRef<THREE.Group>(null);
  const ref = useRef<RAPIER.RigidBody>(null);
  const rapier = useRapier();
  const [, get] = useKeyboardControls();
  const [isHammer, setIsHammer] = useState(false);

  useFrame((state) => {
    const { forward, backward, left, right, jump, weapon1, weapon2 } = get();
    const gp: GameProgress = store.getState().gameProgress

    if (weapon1) {
      setIsHammer(true);
      gp.weapon = 'hammer';
      store.dispatch(setGameProgress(gp));
    }
    if (weapon2) {
      setIsHammer(false);
      gp.weapon = 'axe';
      store.dispatch(setGameProgress(gp));
    }
    const velocity = ref.current?.linvel();
    // update camera
    ref.current? state.camera.position.lerp(ref.current.translation(), 0.5): '';
    // update hammer
    if (weapon.current) {
      weapon.current.children[0].rotation.x = lerp(
        weapon.current.children[0].rotation.x,
        Math.sin(1 * state.clock.elapsedTime * 10) / 6,
        0.1
      );
      weapon.current.rotation.copy(state.camera.rotation);
      weapon.current.position
        .copy(state.camera.position)
        .add(state.camera.getWorldDirection(rotation).multiplyScalar(1));
    }
    // movement
    frontVector.set(0, 0, +backward - +forward);
    sideVector.set(+left - +right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    ref.current?.setLinvel({ x: direction.x, y: velocity?.y || 0, z: direction.z }, true);
    // jumping
    const world = rapier.world;
    const ray = world?.castRay(new RAPIER.Ray(ref.current!.translation(), { x: 0, y: -2, z: 0 }), 1.75, false);
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.25;
    if (jump && grounded) ref.current?.setLinvel({ x: 0, y: 7.5, z: 0 }, true);
  });
  return (
    <>
      <RigidBody ref={ref} colliders="ball" mass={1} type="dynamic" position={[16, 10, -7]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <group ref={weapon}>
        {isHammer && <Hammer position={[0.3, -0.35, 0.5]} />}
        {!isHammer && <Axe position={[0.3, -0.35, 0.5]} />}
      </group>
    </>
  );
}
