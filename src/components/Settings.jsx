/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/


import { useState } from "react";
import styles from "./Settings.module.css";

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
                <p></p>
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
            <div className="support-form">
                <h3>Support Request</h3>
                <form>
            <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
                type="email"
                id="email"
                required
                placeholder="your@email.com"
            />
        </div>
        
        <div className="form-group">
            <label htmlFor="description">Problem Description *</label>
            <textarea
                id="description"
                required
                placeholder="Please describe the issue you're experiencing..."
                rows={4}
            />
        </div>
        <div className="form-group">
            <label htmlFor="steps">Steps to Reproduce</label>
            <textarea
                id="steps"
                placeholder="1. First step&#10;2. Second step&#10;3. ..."
                rows={3}
            />
        </div>

        <button type="submit" className="submit-button">
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
