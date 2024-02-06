
import { Suspense, useState } from 'react'
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'


function Model({url = ""}) {
    // useGLTF suspends the component, it literally stops processing
    const { scene } = useGLTF(url)
  // By the time we're here the model is gueranteed to be available
  return (
    <>
    {url.length > 0 && <primitive object={scene} />}
    </>
  )
}
function Rotate(props:any) {
  const ref:any = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime
})
  return <group ref={ref} {...props} />
}



export const ModelPreview = ({url = ""}) => {
    console.log(url)
    return (
        <>
            {<Suspense fallback={<span>loading...</span>}>
                <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
                    <directionalLight position={[10, 10, 0]} intensity={1.5} />
                    <directionalLight position={[-10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, 20, 0]} intensity={1.5} />
                    <directionalLight position={[0, -10, 0]} intensity={0.25} />
                    <Rotate position-y={-0.5} scale={0.2}>
                        <Suspense fallback={<Model url={url} />}>
                            <Model url={url} />
                        </Suspense>
                    </Rotate>
                </Canvas>
            </Suspense>}
        </>
    );
};