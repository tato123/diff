import React from 'react';
import { Typography, Empty } from 'antd';

const { Text } = Typography;

const InspectorStyles = {
    display: 'block',
    position: 'absolute',
    width: '200px',
    height: '500px',
    padding: '42px 24px 50px',
    border: '1px solid #ebedf0',
    borderRadius: '2px',
    top: 10,
    right: 32,
    background: '#fff',
    boxShadow: '0 0.25em 0.5em hsla(0,0%,0%,10%)'
}


const CSSInspector = ({ selected }) => {


    return (<div style={InspectorStyles}>
        {!selected && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ height: 40 }} description={<span>No element selected</span>} />
        )}
    </div>)
}

export default CSSInspector;