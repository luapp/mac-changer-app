import { useState, useEffect } from "react";
import { macAddressGenerator } from './Components/Logics/macAddressLogic';
import { accessSaveFile, fetchOriginalMacAddressFromSaveFile } from './Components/Logics/fileManagement';
import { checkOperatingSystem } from './Components/Logics/osCheck';
import { fetchNetworkInterface, macAddressModifier } from './Components/Logics/networkInterfaceManagement';
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
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
                const stepSuccess = await stepFunctions[i](); // Execute step
                if (!stepSuccess) {
                    console.error(`Step ${i + 1} failed...`);
                    setLoading(false); // Stop loading if a step fails
                    return;
                }
                setCompletedSteps(i + 1); // Update progress for loading bar
            }
            setIsOn(prev => !prev); // Toggle the button state after completion
            setLoading(false); // Set loading state to false when all steps are done
        }
        catch (error) {
            console.error("An error occurred during the activation steps:", error);
            setLoading(false); // Set loading state to false if an error occurs
        }
    };
    let loadingPercentage = Math.floor((completedSteps / totalSteps) * 100); // Calculate dynamic percentage

    const executeDeactivationSteps = async () => {
        console.log("Deactivation steps initiated...");
        setLoading(true);
        setCompletedSteps(0);
        const stepFunctions = [asyncFunction04, asyncFunction03, asyncFunction02, asyncFunction01];
        for (let i = 0; i < stepFunctions.length; i++) {
            await stepFunctions[i]();
            setCompletedSteps(i + 1);
        }
        setIsOn(prev => !prev);
        setLoading(false);
    }

    useEffect(() => {
        const fetchCurrentOs = async () => {
            const currentOs = await checkOperatingSystem();
            if (currentOs !== 'MacOS') {
                setLoading(true);
                loadingPercentage = "OS not supported yet :(";
            }
        }
        fetchCurrentOs();
    }, []);
    
    return (
        <div className={styles.app}>
            <button
                onClick={executeSteps}
                disabled={loading} // Disable button while loading
                className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
                style={loading ? { '--completedSteps': completedSteps, '--totalSteps': totalSteps } : {}}
            >
                {loading 
                    ? `${loadingPercentage}% Completed...` 
                    : isOn ? 'Disable' : 'Activate'}
            </button>
        </div>
    );
}

export default App;
