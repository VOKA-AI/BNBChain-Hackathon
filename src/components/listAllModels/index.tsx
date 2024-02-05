import { Suspense } from 'react'
import { useEffect, useState,useRef } from 'react';
import { useAccount } from 'wagmi';
import { client, selectSp } from '../../client';
import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import { getOffchainAuthKeys } from '../../utils/offchainAuth';
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'

function Model() {
  // useGLTF suspends the component, it literally stops processing
  const { scene } = useGLTF("/bust-hi.glb")
  // By the time we're here the model is gueranteed to be available
  return <primitive object={scene} />
}
function Rotate(props:any) {
  const ref:any = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime
})
  return <group ref={ref} {...props} />
}

function Box(props:any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref:any = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if(ref.current) {
        ref.current.rotation.x += delta
    }
})
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


export const ModelList = () => {
    const { address, connector } = useAccount();
    const [info, setInfo] = useState<{
        bucketName: string;
        objectName: string;
        file: File | null;
    }>({
        bucketName: '',
        objectName: '',
        file: null
    });
    const [objs1, setObjs1] = useState<Array<ObjectMeta>>([])

    const getModels = async () => {
        if (!address) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const res = await client.object.listObjects(
            {
                bucketName: address.toLowerCase(),
                endpoint: spInfo.endpoint,
            },
        );

        setObjs1(res.body!.GfSpListObjectsByBucketNameResponse.Objects)

    }
    useEffect(() => {
        getModels()
    }, [])

    return (
        <>
            <div className='box'>
                <div className='field'>
                    {objs1.map((item) => {
                        return (
                            <div>{item.ObjectInfo.ObjectName}</div>
                        )
                    })}
                </div>
            </div>
            <Suspense fallback={<span>loading...</span>}>
                <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
                    <directionalLight position={[10, 10, 0]} intensity={1.5} />
                    <directionalLight position={[-10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, 20, 0]} intensity={1.5} />
                    <directionalLight position={[0, -10, 0]} intensity={0.25} />
                    <Rotate position-y={-0.5} scale={0.2}>
                        <Suspense fallback={<Model />}>
                            <Model />
                        </Suspense>
                    </Rotate>
                </Canvas>
            </Suspense>
        </>
    );
};