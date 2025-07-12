import { Canvas } from "@react-three/fiber"
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import { Ground } from './models/Ground' 
import React from 'react';
import { Player } from './models/Player'
import { Cube, Cubes } from "./models/Cubes"
import { Steve } from './models/Steve'
import { Tree } from './models/Tree'
import Creeper from './models/Creeper'
import Villager from './models/Villager'
import Enderman from './models/Enderman'
import IronGolem from './models/IronGolem'
import Pig from './models/Pig'
import Cow from './models/Cow'
import Chicken from './models/Chicken'
import BuchersYard from './models/BuchersYard'
import WindowContext from './math/WindowContext'

const Level1 = () => {
  const { enableView, controlsRef, handleOpen } = React.useContext(WindowContext);
  return (
    <div className={' bg-white absolute w-full h-screen p-0 top-0 left-0'}> 
      <div className='fixed bottom-0 left-0 w-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-40'>
        <div className="p-8 rounded-lg shadow-lg text-white text-current text-1xl italic font-bold z-40">MAX's MineMaths V0.1 2024</div>
      </div>
      <div className={'h-full w-full p-0 '}>
      <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "weapon1", keys: ["h", "H"] },
        { name: "weapon2", keys: ["p", "P"] },
      ]}>
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={3} />
        
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        {/* <Axe position={[1, 0, 0]} /> */}
        <Physics gravity={[0, -30, 0]}>
          <Ground />
          <RigidBody type="fixed" colliders="trimesh">
            <BuchersYard position={[0, 0, 10]} scale={20}/>
            {/* <MineCraft position={[0, 0, -100]} scale={20}/> */}

          </RigidBody>
          <Player />
          <Cube position={[-1, 4.73, -17]} />
          <Cubes />
          <RigidBody type="fixed" colliders="trimesh">
            <Steve position={[2, 5.8, -17]} scale={0.1} onClick={handleOpen}/> 
            <Tree position={[6, 0.5, -22]} scale={7.5} onClick={handleOpen}/>
            <Creeper position={[8, 6, -17]} scale={0.13} onClick={handleOpen}/>
            <Villager position={[12, 7.2, -17]} scale={0.1} onClick={handleOpen}/>
            <Enderman position={[14, 6.5, -17]} scale={0.1} onClick={handleOpen}/>
            <IronGolem position={[18, 6.3, -15]} scale={0.1} onClick={handleOpen}/>
            <Pig position={[22, 4.7, -17]} scale={0.06} onClick={handleOpen}/>
            <Cow position={[24, 5.4, -17]} scale={0.07} onClick={handleOpen}/>
            <Chicken position={[26, 4.5, -17]} scale={0.03} onClick={handleOpen}/>
          </RigidBody>
        </Physics>
        {enableView && <PointerLockControls ref={controlsRef}/>}
        {/* <OrbitControls /> */}
      </Canvas>
      </KeyboardControls>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white" />
      </div>
    </div>
  )
}
 
export default Level1