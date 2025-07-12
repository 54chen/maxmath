// WindowContext.tsx

import React, { MutableRefObject, useRef } from 'react';
import Window from './Window';
import { PointerLockControls } from 'three-stdlib';

// 创建一个 Context
const WindowContext = React.createContext<{
  enableView: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  controlsRef: MutableRefObject<PointerLockControls|null>;
}>({
  enableView: true,
  handleOpen: () => {},
  handleClose: () => {},
  controlsRef: (null as unknown) as MutableRefObject<PointerLockControls>,
});

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enableView, setEnableView] = React.useState(true);
  const controlsRef = useRef<PointerLockControls>(null!);

  const handleOpen = () => {
    setTimeout(() => {
      controlsRef.current.unlock();    
      setEnableView(false);
    }, 100);
  };

  const handleClose = () => {
    setEnableView(true);
    setTimeout(() => {controlsRef.current.lock();}, 100);
  };

  // 使用 Context Provider 提供状态和方法
  return (
    <WindowContext.Provider value={{ enableView, controlsRef, handleOpen, handleClose }}>
      <Window />
      {children}
    </WindowContext.Provider>
  );
};

export default WindowContext;
