/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/


import { useState } from "react";
import styles from "./Settings.module.css";

const SettingsHome = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <ul className={styles.settingsList}>
            <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
            <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
            <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
            <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
            <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
        </ul>
    );
}

const SettingsGeneral = () => {
    return (
        <div>
            <p>general</p>
        </div>
    );
}

const SettingsInterfaceConfiguration = () => {
    return (
        <div>
            <p>SettingsInterfaceConfiguration</p>
        </div>
    );
}

const SettingsMACAddressSettings = () => {
    return (
        <div>
            <p>SettingsMACAddressSettings</p>
        </div>
    );
}

const SettingsHelpSupport = () => {
    return (
        <div>
            <p>SettingsHelpSupport</p>
        </div>
    );
}

const SettingsAbout = () => {
    return (
        <div className={styles.settingsFixedOverlay}>
            <div className={styles.settingsContent}>
                <h1 className={styles.settingsTitleText}>About</h1>
                <ul className={styles.settingsList}>
                </ul>
            </div>
        </div>
    );
}

const Settings = () => {

    const [currentSettings, setCurrentSettings] = useState("Settings");



    return (
        <div className={styles.settingsFixedOverlay}>
            <div className={styles.settingsContent}>
                <h1 className={styles.settingsTitleText}>{currentSettings}</h1>
                {currentSettings === "Settings" && <SettingsHome setCurrentSettings={setCurrentSettings} />}
                {currentSettings === "General" && <SettingsGeneral />}
                {currentSettings === "Interface Configuration" && <SettingsInterfaceConfiguration />}
                {currentSettings === "MAC Address Settings" && <SettingsMACAddressSettings />}
                {currentSettings === "Help & Support" && <SettingsHelpSupport />}
                {currentSettings === "About" && <SettingsAbout />}
            </div>
        </div>
    );
}

export default Settings;
