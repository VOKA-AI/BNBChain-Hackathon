import { useEffect, useState,useRef } from 'react';
import { useAccount } from 'wagmi';
import { client, selectSp } from '../../client';
import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import { getOffchainAuthKeys } from '../../utils/offchainAuth';
import { ModelPreview } from '../modelPreview';


export const ModelList = () => {
    const { address, connector } = useAccount();
    const [objs1, setObjs1] = useState<Array<ObjectMeta>>([])
    //const [modelUrl, setModelUrl] = useState("https://github.com/VOKA-AI/react-face-mask/blob/main/public/Duck2.glb?raw=true")
    const [modelUrl, setModelUrl] = useState("/Duck3.glb")

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
    const getModelFile = async (objName: string) => {
        if (!address) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const res1 = await client.object.getObjectPreviewUrl(
            {
                bucketName: address.toLowerCase(),
                objectName: objName,
                queryMap: {
                    view: '1',
                    'X-Gnfd-User-Address': address,
                    'X-Gnfd-App-Domain': window.location.origin,
                    'X-Gnfd-Expiry-Timestamp': '2023-09-03T09%3A23%3A39Z',
                },
            },
            {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
            },
        );
        console.log(res1)
        setModelUrl(res1)
    }

    useEffect(() => {
        getModels()
    }, [])

    return (
        <>
            <div className='box'>
                <div>
                    {objs1.map((item: ObjectMeta) => {
                        return (
                            <div>
                                <button onClick={(e: any) => {
                                    console.log(e)
                                    getModelFile(e.target.innerText)
                                }}>
                                    {item.ObjectInfo.ObjectName}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div>
                <ModelPreview url={modelUrl}
                />
            </div>
        </>
    );
};