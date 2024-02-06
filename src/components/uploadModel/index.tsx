import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { client, selectSp } from '../../client';
import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import { getOffchainAuthKeys } from '../../utils/offchainAuth';
import { message } from 'antd';
import './index.css';

export const UploadModel = () => {
    const [messageApi, contextHolder] = message.useMessage();
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
    const createBucket = async () => {
        if (!address) return;

        const spInfo = await selectSp();

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            messageApi.error('No offchain, please create offchain pairs first');
            return;
        }

        try {
            const createBucketTx = await client.bucket.createBucket(
                {
                    bucketName: address.toLowerCase(),
                    creator: address,
                    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                    chargedReadQuota: '0',
                    spInfo: {
                        primarySpAddress: spInfo.primarySpAddress,
                    },
                    paymentAddress: address,
                },
                {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                },
            );

            const simulateInfo = await createBucketTx.simulate({
                denom: 'BNB',
            });

            const res = await createBucketTx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateInfo?.gasLimit),
                gasPrice: simulateInfo?.gasPrice || '5000000000',
                payer: address,
                granter: '',
            });

            if (res.code === 0) {
                messageApi.success("join succeed!")
                window.location.reload()
            }
        } catch (err) {
            if (err instanceof Error) {
                messageApi.error(err.message)
            }
            if (err && typeof err === 'object') {
                messageApi.error(JSON.stringify(err))
            }
        }

    };

    const uploadModel = async () => {
        if (!address || !info.file) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            messageApi.error('No offchain, please create offchain pairs first');
            return;
        }

        const rs = new ReedSolomon();
        const fileBytes = await info.file.arrayBuffer();
        const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

        try {
            const createObjectTx = await client.object.createObject(
                {
                    bucketName: address.toLowerCase(),
                    objectName: info.file.name,
                    creator: address,
                    visibility: 'VISIBILITY_TYPE_PRIVATE',
                    fileType: info.file.type,
                    redundancyType: 'REDUNDANCY_EC_TYPE',
                    contentLength: fileBytes.byteLength,
                    expectCheckSums: expectCheckSums,
                },
                {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                },
            );

            const simulateInfo = await createObjectTx.simulate({
                denom: 'BNB',
            });

            console.log('simulateInfo', simulateInfo);

            const res = await createObjectTx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateInfo?.gasLimit),
                gasPrice: simulateInfo?.gasPrice || '5000000000',
                payer: address,
                granter: '',
            });

            if (res.code === 0) {
                //setTxnHash(res.transactionHash);
                //alert('create object success');


                const uploadRes = await client.object.uploadObject(
                    {
                        bucketName: address.toLowerCase(),
                        objectName: info.file.name,
                        body: info.file,
                        txnHash: res.transactionHash,
                    },
                    {
                        type: 'EDDSA',
                        domain: window.location.origin,
                        seed: offChainData.seedString,
                        address,
                    },
                );

                if (uploadRes.code === 0) {
                    messageApi.success('upload model success!');
                    window.location.reload()
                }
            }
        } catch (err) {
            console.log(typeof err)
            if (err instanceof Error) {
                messageApi.error(err.message)
            }
            if (err && typeof err === 'object') {
                messageApi.error(JSON.stringify(err))
            }
        }

    }

    return (
        <div className='upload_model_container'>
            {contextHolder}
            <label className="file-label">
                <input className="file-input" type="file" name="resume" onChange={(e) => {

                    if (e.target.files) {
                        setInfo({
                            ...info,
                            file: e.target.files[0]
                        })
                    }
                }} />
                <span className="file-cta">
                    <span className='file-label'>
                        {info.file ? info.file.name : "选择模型"}
                    </span>
                </span>
            </label>

            {/* upload */}
            <div className='file-upload'>
                <button
                    // disabled={txnHash === ''}
                    className="button is-primary"
                    onClick={uploadModel}
                >
                    上传模型
                </button>
            </div>

            <div className="join">
                <button
                    className={'button is-primary'}
                    onClick={createBucket}

                >
                    加入
                </button>
            </div>

        </div>
    );
};