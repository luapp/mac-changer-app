import { useState, useEffect } from "react";
import { mac_address_generator } from './Components/Logics/macAddressGenerator';
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false); // For tracking the on/off state
    const [loading, setLoading] = useState(false); // For tracking loading state
    const [completedSteps, setCompletedSteps] = useState(0); // Track steps completed
    const totalSteps = 4; // Dynamic total number of steps, adjust as needed

    const asyncFunction01 = async () => {
        const randomDelay = 1 // Random delay between 1s and 3s
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction02 = async () => {
        const randomDelay = 1 // Random delay between 1s and 3s
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction03 = async () => {
        const randomDelay = 1 // Random delay between 1s and 3s
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const asyncFunction04 = async () => {
        const randomDelay = 1 // Random delay between 1s and 3s
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    const executeSteps = async () => {
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
    const loadingPercentage = Math.floor((completedSteps / totalSteps) * 100); // Calculate dynamic percentage

    
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
