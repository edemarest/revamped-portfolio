import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import styles from './ModelViewer.module.css';
import '../../index.css';

type ModelViewerProps = {
  modelPath: string;
  cameraConfig: { position: [number, number, number]; fov: number };
  scale?: number;
  onContextLost?: () => void;
};

const ModelPrimitive = React.memo(function ModelPrimitive({ modelPath, scale }: { modelPath: string; scale?: number }) {
  const { scene } = useGLTF(modelPath);
  // Use provided scale or fallback
  const finalScale = scale ?? (modelPath.includes('TreasureChest') ? 2.5 : 1.2);

  useEffect(() => {
    // Only log/cleanup when modelPath changes
    console.log(`[ModelPrimitive] Mounted for:`, modelPath);
    return () => {
      console.log(`[ModelPrimitive] Unmounting and cleaning up:`, modelPath);
      if (scene) {
        scene.traverse((obj: any) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat: any) => mat.dispose && mat.dispose());
            } else {
              obj.material.dispose && obj.material.dispose();
            }
          }
        });
      }
    };
  }, [scene, modelPath]);

  return <primitive object={scene} scale={finalScale} position={[0, -1, 0]} />;
});

export default function ModelViewer({ modelPath, cameraConfig, scale, onContextLost }: ModelViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Attach context loss handler (cast to EventListener, event as any)
    const handleContextLost: EventListener = (e) => {
      e.preventDefault();
      if (onContextLost) onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost, false);
    };
  }, [onContextLost]);

  // Remove useEffect for canvasCount if you want to avoid remount logs
  return (
    <div className={styles.canvasWrapper}>
      <Canvas
        key={modelPath} // Only remount if modelPath changes
        style={{ width: '100%', height: '100%' }}
        camera={{ position: cameraConfig?.position, fov: cameraConfig?.fov }}
        frameloop="demand"
      >
        {/* Softer ambient light for base illumination */}
        <ambientLight intensity={1.2} />
        {/* Strong directional light from above/front for main shading */}
        <directionalLight position={[0, 20, 20]} intensity={2.8} castShadow />
        {/* Rim light from behind for edge highlights */}
        <directionalLight position={[-20, 10, -20]} intensity={.6} color="#fff" />
        {/* Optional: subtle fill light from the side */}
        <directionalLight position={[15, 5, 0]} intensity={0.7} color="#ffcccc" />
        {/* Environment for soft reflections */}
        <Environment preset="sunset" background={false} />
        <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="#222" /></mesh>}>
          <ModelPrimitive modelPath={modelPath} scale={scale} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

