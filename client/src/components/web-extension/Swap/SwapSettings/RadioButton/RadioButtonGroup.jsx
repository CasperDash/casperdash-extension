import React, { Children, cloneElement, useMemo, isValidElement } from 'react';

const RadioButtonGroup = ({children, value, onChange, name, className}) => {
    const items = useMemo(() => {
        const childList = [];
    
        Children.forEach(children, (child) => {
          if (!child || !isValidElement(child)) {
            return;
          }
    
          childList.push(child);
        });
    
        return childList;
    }, [children]);

    if (!items || Children.count(items) === 0) {
        return null;
    }
    

    return (
        <div className={className}>
            {
                items.map((item) => {
                    return cloneElement(item, {
                        name,
                        checked: item.props.value === value,
                        onChange: onChange,
                    })
                })
            }
        </div>
    )
}

export default RadioButtonGroup;