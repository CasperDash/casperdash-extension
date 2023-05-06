import React, { forwardRef } from 'react';

import './RadioButton.scss';

const RadioButton = forwardRef(({ value, onChange, checked, children }) => {
    return (
        <label className="cd_we_radio_button">
            <input type="radio" name="radio" value={value} onChange={evt => onChange?.(evt.target.value)} checked={checked} />
            {children}
        </label>
    )
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;