import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-konva';

const CanvasText = ({text, x, y}) => {
    return (
        <Text text={text} fontSize={14} x={x} y={y} />
    )
}

CanvasText.propTypes = {
	text: PropTypes.string,
	x: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
	y: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

export default CanvasText;