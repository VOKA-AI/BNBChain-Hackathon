import { useEffect, useState,useRef } from 'react';
import { useAccount } from 'wagmi';
import { client, selectSp } from '../../client';
import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import { getOffchainAuthKeys } from '../../utils/offchainAuth';
import { ModelPreview } from '../modelPreview';
import {Button, List,Card,message, Popover } from 'antd'
import { BytesNum2Str, stringMaxLen } from '../../utils/utilFuncs';


export const ModelList = () => {
    const [messageApi, contextHolder] = message.useMessage();
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
            messageApi.error('No offchain, please create offchain pairs first');
            return;
        }

        const res = await client.object.listObjects(
            {
                bucketName: address.toLowerCase(),
                endpoint: spInfo.endpoint,
            },
        );

        setObjs1(res.body!.GfSpListObjectsByBucketNameResponse.Objects)
        if(res.body!.GfSpListObjectsByBucketNameResponse.Objects.length > 0) {
            getModelFile(res.body!.GfSpListObjectsByBucketNameResponse.Objects[0].ObjectInfo.ObjectName)
        }

    }

    const deleteFile = async (objName: any) => {
        if (!address) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            messageApi.error('No offchain, please create offchain pairs first');
            return;
        }
        const tx = await client.object.deleteObject({
            bucketName: address.toLowerCase(),
            objectName: objName,
            operator: address,
        });

        const simulateTx = await tx.simulate({
            denom: 'BNB',
        });

        const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateTx?.gasLimit),
            gasPrice: simulateTx?.gasPrice || '5000000000',
            payer: address,
            granter: '',
        });
        if(res.code == 0) {
             window.location.reload()
        }
        console.log(res)

    }
    const getModelFile = async (objName: string) => {
        if (!address) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            messageApi.error('No offchain, please create offchain pairs first');
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
            <div style={{paddingTop:20}}>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 8,
                    }}
                    dataSource={objs1}
                    renderItem={(item: ObjectMeta, index: number) => (
                        <List.Item>
                            <Popover content={(
                                <div>
                                    <p> Id: {item.ObjectInfo.Id}</p>
                                    <p>Creator: {item.ObjectInfo.Creator}</p>
                                    <p>Ower: {item.ObjectInfo.Owner}</p>
                                    <p>
                                        Size: {BytesNum2Str(item.ObjectInfo.PayloadSize)}
                                    </p>
                                    <p>
                                        Hash: {item.CreateTxHash}
                                    </p>
                                </div>
                            )}>
                            <Card bordered={false} hoverable={true} title={item.ObjectInfo.ObjectName}
                                actions={[
                                    <Button onClick={(e: any) => { getModelFile(item.ObjectInfo.ObjectName) }}>Preview Model</Button>,
                                    <Button danger={true} onClick={(e: any) => { deleteFile(item.ObjectInfo.ObjectName) }}>Delete</Button>,
                                ]}
                            >Size: {BytesNum2Str(item.ObjectInfo.PayloadSize)}<br></br>Hash: {stringMaxLen(item.CreateTxHash, 10)}</Card>
                            </Popover>
                        </List.Item>
                    )}
                />
            </div>
            <div>
                <ModelPreview url={modelUrl}
                />
            </div>
            {contextHolder}
        </>
    );
};