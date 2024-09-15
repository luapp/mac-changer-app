import { useState, useEffect } from "react";
import { getCurrentMacAddress } from './Components/Logics/macAddressLogic';
import { checkOperatingSystem } from './Components/Logics/osCheck';
import { executeActivationSteps, executeDeactivationSteps } from './Components/Logics/toggle';
import Header from "./Components/UI/Header";
import styles from './App.module.css';

const App = () => {
    const [isOn, setIsOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [currentMacAddress, setCurrentMacAddress] = useState(undefined);

    const executeSteps = async () => {
        let status = undefined;
        if (isOn) {
            status = await executeDeactivationSteps({ setIsOn, setLoading, setCompletedSteps });
            if (status === undefined) {
                console.error("Failed to execute deactivation steps...");
            }
        } else {
            status = await executeActivationSteps({ setIsOn, setLoading, setCompletedSteps });
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
            <Header />
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
                <p>Current MAC Address:</p>
                <p>{currentMacAddress}</p>
            </div>
        </div>
    );
}

export default App;
