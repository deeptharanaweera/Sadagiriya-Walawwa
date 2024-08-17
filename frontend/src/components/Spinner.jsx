import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import React from 'react';

const Spinner = () => {
    return (

        <Flex align="center" gap="middle" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100}}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 58 }} spin />} />
</Flex>


    )
}

export default Spinner