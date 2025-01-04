/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import styles from "./Header.module.css"
import gearShapeEmptySf10 from "../resources/images/gearShapeEmptySf10.png"
import gearShapeFillSf10 from "../resources/images/gearShapeFillSf10.png"

const Header = ({isSettingsOpen,setIsSettingsOpen}) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mac Changer</h1>
            <div className={styles.settings}>
                <img src={gearShapeFillSf10} className={styles.settingsGearIcon} onClick={() => setIsSettingsOpen(!isSettingsOpen)}></img>
            </div>
        </div>
    );
}

export default Header;