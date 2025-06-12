import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function Airplane({ targetPosition = new THREE.Vector3(0, 2, 5) }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/scene.gltf");
  const [hasFlown, setHasFlown] = useState(false);
  const velocity = useRef(0.05);
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(-10, 5, 0);
      ref.current.scale.set(0.5, 0.5, 0.5);
    }
  }, []);

  useFrame(() => {
    if (ref.current && !hasFlown) {
      // Bereken vector van huidige positie naar target
      direction.current.subVectors(targetPosition, ref.current.position);
      const distance = direction.current.length();

      // Richting normaliseren
      direction.current.normalize();

      // Versnel iets
      velocity.current += 0.0005;

      // Beweeg het vliegtuig in de richting van de target
      ref.current.position.addScaledVector(direction.current, velocity.current);

      // Schaal afhankelijk van afstand (bijv. van 0.5 op 15 units afstand tot 1.5 op 0 afstand)
      const minScale = 0.5;
      const maxScale = 1.5;
      const maxDistance = 15;
      const scale = THREE.MathUtils.lerp(maxScale, minScale, distance / maxDistance);
      ref.current.scale.set(scale, scale, scale);

      // Rotatie naar de richting van beweging
      ref.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // model neus richting
        direction.current
      );

      // Stoppen als heel dichtbij (bv < 0.1)
      if (distance < 0.1) {
        ref.current.visible = false;
        setHasFlown(true);
      }
    }
  });

  return <primitive ref={ref} object={scene} />;
}

function FlyingPlaneCanvas() {
  // Zelfde camera als target:
  const cameraPosition = new THREE.Vector3(0, 2, 5);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <Canvas gl={{ alpha: true }} camera={{ position: [0, 2, 7], fov: 60, near: 0.1, far: 1000 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <Suspense fallback={null}>
          <Airplane targetPosition={cameraPosition} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default FlyingPlaneCanvas;
