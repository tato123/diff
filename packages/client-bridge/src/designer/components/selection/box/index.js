import React, { useEffect, useState } from 'react';
import { deepElementFromPoint } from '../../../utils/selection';

const HostStyle = ({ top, left }) => {
    return (< style >
        {`
    svg.box {
        position: absolute;
        top: ${top + window.scrollY}px;
        left: ${left}px;
        overflow: visible;
        pointer-events: none;
        z-index: 2147483644;
      }
    `}

    </style >
    )
}




const Box = (props) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [target, setTarget] = useState(null);
    const { active, onSelect } = props;

    const w = width / 2;
    const h = height / 2;
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);





    const mousePosition = (e) => {
        requestAnimationFrame(() => {
            const element = deepElementFromPoint(e.clientX, e.clientY);
            const targetBounds = element.getBoundingClientRect()

            setTarget(element);
            setTop(targetBounds.top);
            setLeft(targetBounds.left);
            setWidth(targetBounds.width);
            setHeight(targetBounds.height)
        })

    }

    const handleClick = (e) => {
        e.preventDefault();
        onSelect(target);
    }


    useEffect((e) => {
        if (!active) {
            return;
        }

        window.addEventListener('mousemove', mousePosition);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', mousePosition)
            window.removeEventListener('click', handleClick)
        }
    }, [active, target])


    if (!active) {
        return null;
    }

    return (
        <React.Fragment>
            <HostStyle top={top} left={left} />
            <svg
                className="visbug-handles box"
                width={width} height={height}
                viewBox={`0 0 ${width} ${height} `}
                version="1.1" xmlns="http://www.w3.org/2000/svg"
            >
                <rect stroke="hotpink" fill="none" width="100%" height="100%"></rect>
                <circle stroke="hotpink" fill="white" cx="0" cy="0" r="2"></circle>
                <circle stroke="hotpink" fill="white" cx="100%" cy="0" r="2"></circle>
                <circle stroke="hotpink" fill="white" cx="100%" cy="100%" r="2"></circle>
                <circle stroke="hotpink" fill="white" cx="0" cy="100%" r="2"></circle>
                <circle fill="hotpink" cx={w} cy="0" r="2"></circle>
                <circle fill="hotpink" cx="0" cy={h} r="2"></circle>
                <circle fill="hotpink" cx={w} cy={height} r="2"></circle>
                <circle fill="hotpink" cx={width} cy={height / 2} r="2"></circle>
            </svg>


        </React.Fragment >
    )

}



export default Box;