/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/


import { useState } from "react";
import styles from "./Settings.module.css";
import Toggle from "../Toggle";

const SettingsGeneral = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <div className={styles.settingsListContainer}>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
            </ul>
            <div>
                <p></p>
            </div>
        </div>
    );
}

const SettingsInterfaceConfiguration = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <div className={styles.settingsListContainer}>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
            </ul>
            <div>
                <p></p>
            </div>
        </div>
    );
}

const SettingsMACAddressSettings = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <div className={styles.settingsListContainer}>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
            </ul>
            <div>
                <p>Random mac address: </p>
                <Toggle isOn={true} scale={1} />
            </div>
        </div>
    );
}

const SettingsHelpSupport = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <div className={styles.settingsListContainer}>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
            </ul>
            <div className={styles.supportForm}>
                <p className={styles.title}>Support Request</p>
                <form>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            required
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <textarea
                            id="description"
                            className={styles.textarea}
                            required
                            placeholder="Please describe the issue you're experiencing..."
                            rows={4}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <textarea
                            id="steps"
                            className={styles.textarea}
                            placeholder="1. First step&#10;2. Second step&#10;3. ..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Submit Support Request
                    </button>
                </form>
            </div>
        </div>
    );
}

const SettingsAbout = ({setCurrentSettings}) => {

    const handleSettingsChange = (newSettingsState) => {
        setCurrentSettings(newSettingsState);
    }

    return (
        <div className={styles.settingsListContainer}>
            <ul className={styles.settingsList}>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("General")}>General</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Interface Configuration")}>Interface Configuration</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("MAC Address Settings")}>MAC Address Settings</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("Help & Support")}>Help & Support</li>
                <li className={styles.settingsListElement} onClick={() => handleSettingsChange("About")}>About</li>
            </ul>
            <div>
                <p></p>
            </div>
        </div>
    );
}

const Settings = () => {

    const [currentSettings, setCurrentSettings] = useState("General");


    return (
        <div className={styles.settingsFixedOverlay}>
            <div className={styles.settingsContent}>
                <h1 className={styles.settingsTitleText}>{currentSettings}</h1>
                {currentSettings === "General" && <SettingsGeneral setCurrentSettings={setCurrentSettings} />}
                {currentSettings === "Interface Configuration" && <SettingsInterfaceConfiguration setCurrentSettings={setCurrentSettings} />}
                {currentSettings === "MAC Address Settings" && <SettingsMACAddressSettings setCurrentSettings={setCurrentSettings} />}
                {currentSettings === "Help & Support" && <SettingsHelpSupport setCurrentSettings={setCurrentSettings} />}
                {currentSettings === "About" && <SettingsAbout setCurrentSettings={setCurrentSettings} />}
            </div>
        </div>
    );
}

export default Settings;
