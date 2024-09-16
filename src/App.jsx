import { useState, useEffect } from "react";
import { getCurrentMacAddress } from './Components/Logics/macAddressLogic';
import { checkOperatingSystem } from './Components/Logics/osCheck';
import { lookupSaveFile, lookupLocalSaveDirPath, fetchOriginalMacAddressFromSaveFile } from './Components/Logics/fileManagement';
import { executeActivationSteps, executeDeactivationSteps } from './Components/Logics/toggle';
import Header from "./Components/UI/Header";
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [currentMacAddress, setCurrentMacAddress] = useState(undefined);
    const [manualMacAddress, setManualMacAddress] = useState(false);

    const executeSteps = async () => {
        let status = undefined;
        if (isOn) {
            status = await executeDeactivationSteps({ setIsOn, setLoading, setCompletedSteps, setCurrentMacAddress });
            if (status === undefined) {
                console.error("Failed to execute deactivation steps...");
            }
        } else {
            status = await executeActivationSteps({ setIsOn, setLoading, setCompletedSteps, setCurrentMacAddress });
            if (status === undefined) {
                console.error("Failed to execute activation steps...");
            }
        }
    }


    useEffect(() => {
        const fetchCurrentMacAddress = async () => {
            const currentMac = await getCurrentMacAddress();
            setCurrentMacAddress(currentMac);
        }
        const wasActive = async () => {
            const currentMac = await getCurrentMacAddress();
            let macFromSave = undefined;
            let saveFilePath = undefined;
            const isThereSaveFilePath = await lookupSaveFile();
            if (isThereSaveFilePath === true) {
                saveFilePath = await lookupLocalSaveDirPath();
                if (saveFilePath === undefined) {
                    return;
                }
                macFromSave = await fetchOriginalMacAddressFromSaveFile(`${saveFilePath}app_local_storage.dat`);
            }
            if (macFromSave.trim() !== currentMac.trim()) {
                setIsOn(true);
            }
        }
        fetchCurrentMacAddress();
        wasActive()
    }, [currentMacAddress]);

    useEffect(() => {
        const fetchCurrentOs = async () => {
            const currentOs = await checkOperatingSystem();
            if (currentOs !== 'MacOS') {
                setLoading(true);
            }
        }
        fetchCurrentOs();
    }, []);

    
    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.main}>
                <button
                    onClick={executeSteps}
                    disabled={loading}
                    className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
                    style={loading ? { '--completedSteps': completedSteps } : {}}
                >
                    {
                    loading ? <span>&#x23FB;</span>
                    : isOn ? <span>&#x23FB;</span>
                    : <span>&#x23FB;</span>
                    }
                </button>
                <div className={styles.macAddress}>
                    <p className={styles.textInfo}>Current MAC Address:</p>
                    <p className={styles.textInfo}>{currentMacAddress}</p>
                </div>
                <div className={styles.manualMacAddress}>
                    <p className={styles.textInfo}>Manual input: {manualMacAddress.toString()}</p>
                </div>
            </div>
        </div>
    );
}

export default App;
