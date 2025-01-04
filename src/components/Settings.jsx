/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/


import styles from "./Settings.module.css";

const Settings = () => {
    return (
        <div className={styles.settingsFixedOverlay}>
        <div className={styles.settingsContent}>
            <h1 className={styles.settingsTitleText}>Settings</h1>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement}>General</li>
                <li className={styles.settingsListElement}>Interface Configuration</li>
                <li className={styles.settingsListElement}>MAC Address Settings</li>
                <li className={styles.settingsListElement}>Help & Support</li>
                <li className={styles.settingsListElement}>About</li>
            </ul>
        </div>
    </div>
    );
}

export default Settings;
