import { useCallback, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { create } from "zustand";
import { persist, devtools } from 'zustand/middleware';
import dirt from "./assets/dirt.jpg";
import { ThreeEvent } from "@react-three/fiber";
import store from "../store/store";

// 定义 Cube 类型
type CubeType = [number, number, number];

// 定义 store 的状态类型
interface CubeStoreState {
  cubes: CubeType[];
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
}

// 创建 store
const useCubeStore = create<CubeStoreState>()(
  devtools(  
    persist(
      (set) => ({
        cubes: [],
        addCube: (x, y, z) => set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
        removeCube: (x, y, z) => set((state) => ({ cubes: state.cubes.filter((coords) => coords.join() !== [x, y, z].join()) })),
      }),
      { name: 'storage' },
    ),
  ),
)

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((coords, index) => <Cube key={index} position={coords} />);
};

export function Cube(props: { position: [number, number, number] }) {
  const ref = useRef<RapierRigidBody>(null);
  const [hover, setHover] = useState<number | null>(null);
  const addCube = useCubeStore((state) => state.addCube);
  const removeCube = useCubeStore((state) => state.removeCube);
  const texture = useTexture(dirt);
  const [weapon, setWeapon] = useState(store.getState().gameProgress.weapon);
  store.subscribe(() => {setWeapon(store.getState().gameProgress.weapon);});
  // 处理鼠标移动事件
  const onMove = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setHover(Math.floor(e.faceIndex! / 2));
  }, []);
  
  // 处理鼠标移出事件
  const onOut = useCallback(() => setHover(null), []);

  // 处理点击事件
  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const { x, y, z } = ref.current!.translation();
    const dir: [number, number, number][] = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];
    weapon == 'hammer' ? addCube(...dir[Math.floor(e.faceIndex! / 2)]) : removeCube(x, y, z);
  }, [addCube, removeCube, weapon]);

  return (
    <RigidBody {...props} type="fixed" colliders="ball" ref={ref}>
      <mesh receiveShadow castShadow onPointerMove={onMove} onPointerOut={onOut} onClick={onClick}>
        {[...Array(6)].map((_, index) => (
          <meshStandardMaterial attach={`material-${index}`} key={index} map={texture} color={hover === index ? (weapon!=='hammer'?"green":"hotpink") : "white"} />
        ))}
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
}
