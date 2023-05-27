import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';

const CopyButton = ({text, className}) => {
    const [btnText, setBtnText] = useState('Copy');
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
      }, []);
      

	const onCopy = () => {
		navigator.clipboard.writeText(text);
        setBtnText('Copied');

        timerRef.current = setTimeout(() => {
            setBtnText('Copy');
        }, 2000);
	}

	return (
		<Button variant="normal" onClick={onCopy} className={className} >
            {btnText}
        </Button>
	);
};

export default CopyButton;
