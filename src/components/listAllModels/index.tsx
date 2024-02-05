import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { client, selectSp } from '../../client';
import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import { getOffchainAuthKeys } from '../../utils/offchainAuth';

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
        </>
    );
};