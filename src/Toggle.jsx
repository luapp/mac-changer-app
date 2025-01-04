/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { useState, useEffect } from "react";
import styles from "./Toggle.module.css";

const Toggle = ({ onToggle, isOn, scale, disabled }) => {
    const [toggled, setToggled] = useState(isOn || false);

    useEffect(() => {
        setToggled(isOn);
    }, [isOn]);

    const handleClick = () => {
        if (disabled) return;
        const newToggledState = !toggled;
        setToggled(newToggledState);
        if (onToggle) onToggle(newToggledState);
    };
  
    const baseSize = 25;
    const switchWidth = baseSize * 2 * scale;
    const sliderDiameter = (baseSize - 4) * scale;
    const sliderOffset = 2 * scale;
  
    const switchStyle = {
        width: `${switchWidth}px`,
        height: `${baseSize * scale}px`,
        borderRadius: `${baseSize * scale}px`,
    };
  
    const sliderStyle = {
        width: `${sliderDiameter}px`,
        height: `${sliderDiameter}px`,
        top: `${sliderOffset}px`,
        left: toggled
            ? `${switchWidth - sliderDiameter - sliderOffset}px`
            : `${sliderOffset}px`,
    };
  
    return (
        <div
            className={`${styles.switch} ${toggled ? styles.on : styles.off}`}
            style={switchStyle}
            onClick={handleClick}
        >
            <div className={styles.slider} style={sliderStyle} />
        </div>
    );
};


export default Toggle;
