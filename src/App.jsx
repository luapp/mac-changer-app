import { useState, useEffect } from "react";
import { mac_address_generator } from './Components/Logics/macAddressLogic';
import { accessSaveFile } from './Components/Logics/fileManagement';
import { checkOperatingSystem } from './Components/Logics/osCheck';
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
    const totalSteps = 4;

    const asyncFunction01 = async () => {
        const randomDelay = 1
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction02 = async () => {
        const randomDelay = 1
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction03 = async () => {
        const randomDelay = 1
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction04 = async () => {
        const randomDelay = 1
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };

    const executeSteps = async () => {
        console.log("Steps initiated...");
        if (isOn) {
            await executeDeactivationSteps();
        } else {
            await executeActivationSteps();
        }
    }


    const executeActivationSteps = async () => {
        const accessStatus = await accessSaveFile();
        if (accessStatus === 1) {
            console.error("Failed to access drive and create mac address backup...");
            return;
        }
        console.log("Activation steps initiated...");
        setLoading(true);
        setCompletedSteps(0); // Reset step progress
        const stepFunctions = [asyncFunction01, asyncFunction02, asyncFunction03, asyncFunction04];
        for (let i = 0; i < stepFunctions.length; i++) {
            await stepFunctions[i]();
            setCompletedSteps(i + 1); // Update steps as completed
        }
        setIsOn(prev => !prev); // Toggle the button state after completion
        setLoading(false); // Set loading state to false when all steps are done
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
