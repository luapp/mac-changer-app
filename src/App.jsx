/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import styles from "./App.module.css"
import Header from "./components/Header"
import {useState, useEffect} from "react"
import {getAllNetworkInterfaces, getAllWifiInterfaces, macAddressGenerator} from "./logic/network"
import {fetchOriginalMacAddressFromSaveFile} from "./logic/fileManagement"
import Toggle from "./Toggle"
import Settings from "./components/Settings"
import { invoke } from "@tauri-apps/api/core";

const App = () => {

    const modifyRandomMacAddress = async () => {
        setIsLoading(true);
        if (toggleUpdate) {
            let result = await invoke("modify_random_mac_address", {networkInterface: "en0", macAddress: macAddressGenerator()});
        } else {
            let result = await invoke("modify_random_mac_address", {networkInterface: "en0", macAddress: originalMacAddress});
        }
        setIsLoading(false);
    }

    const [currentAllNetworkInterfaces, setCurrentAllNetworkInterfaces] = useState({});
    const [currentAllWifiInterfaces, setCurrentAllWifiInterfaces] = useState(undefined);
    const [toggleUpdate, setToggleUpdate] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [originalMacAddress, setOriginalMacAddress] = useState(undefined);
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        getAllNetworkInterfaces().then((interfacesObject) => {
            setCurrentAllNetworkInterfaces(interfacesObject);
            const wifiInterface = Object.entries(interfacesObject).find(
                ([_, [interfaceName]]) => interfaceName === "Wi-Fi"
            )?.[1];
            console.log(wifiInterface)
        });
        getAllWifiInterfaces().then((wifiInterfaces) => {
            setCurrentAllWifiInterfaces(wifiInterfaces);
        });
        fetchOriginalMacAddressFromSaveFile().then((macAddress) => {
            setOriginalMacAddress(macAddress);
        });
    }, [isOn]);

    useEffect(() => {
        if (originalMacAddress !== undefined && currentAllWifiInterfaces !== undefined) {
            if (currentAllWifiInterfaces[0][1] !== originalMacAddress) {
                setIsOn(true);
            } else {
                setIsOn(false);
            }
        }
    }, [currentAllWifiInterfaces, originalMacAddress]);

    useEffect(() => {
        if (toggleUpdate !== undefined && currentAllWifiInterfaces !== undefined) {
            console.log("toggleUpdate", toggleUpdate);
            modifyRandomMacAddress();
        }
    }, [toggleUpdate]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsSettingsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className={styles.container}>
            <Header isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}/>
                <div className={styles.appContent}>
                    <div className={styles.toggle}>
                        <Toggle isOn={isOn} onToggle={(state) => setToggleUpdate(state)} scale={3.8} disabled={isLoading}/>
                    </div>
                    <p>
                        {currentAllWifiInterfaces?.[0]?.[0]
                            ? `Default ${currentAllWifiInterfaces[0][0]} device selected`
                            : "Loading default network interface"
                        }
                    </p>
                    <p>
                        {originalMacAddress?.length > 0
                            ? `Original: ${originalMacAddress}`
                            : "Loading original macaddress"
                        }
                    </p>
                    <p>
                        {currentAllWifiInterfaces?.[0]?.[1]
                            ? `Current: ${currentAllWifiInterfaces[0][1]}`
                            : "Loading original macaddress"
                        }
                    </p>
                    {isLoading && (
                        <div className={styles.spinner}>
                            <div className={styles.loader}></div>
                        </div>
                    )}
                </div>
                {isSettingsOpen && (
                    <Settings />
                )}
        </div>
    );
}

export default App;