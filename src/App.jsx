import { useState, useEffect } from "react";
import { macAddressGenerator, getCurrentMacAddress } from './Components/Logics/macAddressLogic';
import { accessSaveFile, fetchOriginalMacAddressFromSaveFile } from './Components/Logics/fileManagement';
import { checkOperatingSystem } from './Components/Logics/osCheck';
import { fetchNetworkInterface, macAddressModifier } from './Components/Logics/networkInterfaceManagement';
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [currentMacAddress, setCurrentMacAddress] = useState(undefined);
    const totalSteps = 3;

    const executeSteps = async () => {
        console.log("Steps initiated...");
        if (isOn) {
            await executeDeactivationSteps();
        } else {
            await executeActivationSteps();
        }
    }


    const executeActivationSteps = async () => {
        console.log("Activation steps initiated...");
        setLoading(true);
        setCompletedSteps(0);
        try {
            let networkInterfaceStatus = undefined;

            const stepFunctions = [
                async () => {
                    const accessStatus = await accessSaveFile();
                    if (accessStatus === undefined) {
                        console.error("Failed to access drive and create MAC address backup...");
                        return false;
                    }
                    const originalMacAddress = await fetchOriginalMacAddressFromSaveFile(accessStatus);
                    console.log(`Original MAC address: ${originalMacAddress}`);
                    if (originalMacAddress === undefined) {
                        console.error("Failed to fetch original MAC address...");
                        return false;
                    }
                    return true;
                },
                async () => {
                    networkInterfaceStatus = await fetchNetworkInterface();
                    if (networkInterfaceStatus === undefined) {
                        console.error("Failed to fetch network interface status...");
                        return false;
                    }
                    return true;
                },
                async () => {
                    let randomMacAddress = undefined;
                    randomMacAddress = macAddressGenerator();
                    if (randomMacAddress === undefined) {
                        console.error("Failed to generate random MAC address...");
                        return false;
                    }
                    const randomMacAddressInjectionStatus = await macAddressModifier(networkInterfaceStatus, randomMacAddress);
                    if (randomMacAddressInjectionStatus === undefined) {
                        console.error("Failed to inject random MAC address...");
                        return false;
                    }
                    return true;
                }
            ];
            for (let i = 0; i < stepFunctions.length; i++) {
                const stepSuccess = await stepFunctions[i]();
                if (!stepSuccess) {
                    console.error(`Step ${i + 1} failed...`);
                    setLoading(false);
                    return;
                }
                setCompletedSteps(i + 1);
            }
            setIsOn(prev => !prev);
            setLoading(false);
        }
        catch (error) {
            console.error("An error occurred during the activation steps:", error);
            setLoading(false);
        }
    };

    const executeDeactivationSteps = async () => {
        console.log("Deactivation steps initiated...");
        setLoading(true);
        setCompletedSteps(0);
        try {
            let networkInterfaceStatus = undefined;
            let originalMacAddress = undefined;

            const stepFunctions = [
                async () => {
                    const accessStatus = await accessSaveFile();
                    if (accessStatus === undefined) {
                        console.error("Failed to access drive and create MAC address backup...");
                        return false;
                    }
                    originalMacAddress = await fetchOriginalMacAddressFromSaveFile(accessStatus);
                    console.log(`Original MAC address: ${originalMacAddress}`);
                    if (originalMacAddress === undefined) {
                        console.error("Failed to fetch original MAC address...");
                        return false;
                    }
                    return true;
                },
                async () => {
                    networkInterfaceStatus = await fetchNetworkInterface();
                    if (networkInterfaceStatus === undefined) {
                        console.error("Failed to fetch network interface status...");
                        return false;
                    }
                    return true;
                },
                async () => {
                    let randomMacAddress = undefined;
                    randomMacAddress = macAddressGenerator();
                    if (randomMacAddress === undefined) {
                        console.error("Failed to generate random MAC address...");
                        return false;
                    }
                    const randomMacAddressInjectionStatus = await macAddressModifier(networkInterfaceStatus, originalMacAddress);
                    if (randomMacAddressInjectionStatus === undefined) {
                        console.error("Failed to inject random MAC address...");
                        return false;
                    }
                    return true;
                }
            ];
            for (let i = 0; i < stepFunctions.length; i++) {
                const stepSuccess = await stepFunctions[i]();
                if (!stepSuccess) {
                    console.error(`Step ${i + 1} failed...`);
                    setLoading(false);
                    return;
                }
                setCompletedSteps(i + 1);
            }
            setIsOn(prev => !prev);
            setLoading(false);
        }
        catch (error) {
            console.error("An error occurred during the activation steps:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchCurrentMacAddress = async () => {
            const currentMac = await getCurrentMacAddress();
            setCurrentMacAddress(currentMac);
        }
        fetchCurrentMacAddress();
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
            <button
                onClick={executeSteps}
                disabled={loading}
                className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
                style={loading ? { '--completedSteps': completedSteps, '--totalSteps': totalSteps } : {}}
            >
                {
                loading ? <span>&#x23FB;</span>
                : isOn ? <span>&#x23FB;</span>
                : <span>&#x23FB;</span>
                }
            </button>
            <div className={styles.macAddress}>
                <p>Current MAC Address:</p>
                <p>{currentMacAddress}</p>
            </div>
        </div>
    );
}

export default App;
