import React, { useContext } from 'react';
import { Typography, Empty } from 'antd';
import SelectionContext from '../../context/Selection';
import "./index.css";

const { Text } = Typography;




const CSSInspector = ({ selected }) => {
    const selContext = useContext(SelectionContext);

    if (selContext == null) {
        return null;
    }



    const computed = window.getComputedStyle(selContext);

    return (
        <div className="inspector">
            <div className="inspector-field">
                <label>TagName:</label>
                <label>{selContext.tagName}</label>
            </div>

            <div className="inspector-field">
                <label>Inner Value:</label>
                <label>{selContext.innerText || selContext.innerHTML}</label>
            </div>
        </div>
    )
}

export default CSSInspector;