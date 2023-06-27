import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CanvasText = ({text, width, height}) => {
    const canvasRef = useRef();

    const writeText = (info, style = {}) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { text, x, y } = info;
        const { fontSize = 14, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
     
        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.stroke();
        ctx.save();
    }

    useEffect(() => {
        writeText({ text, x: 4, y: 0 });
    }, [text]); 

    return (
        <canvas
	ref={canvasRef} 
	width={width}
	height={height}
        />
    )
}

CanvasText.propTypes = {
	text: PropTypes.string,
	width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
	height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

export default CanvasText;