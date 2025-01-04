/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import styles from "./App.module.css"
import Header from "./Header"
import {useState, useEffect} from "react"
import {getAllNetworkInterfaces, getAllWifiInterfaces} from "./logic/network"
import Toggle from "./Toggle"
import Settings from "./Settings"

import { invoke } from "@tauri-apps/api/core";

const App = () => {

    const randomtime = async () => {
        setIsLoading(true);
        let res = await invoke("random_time_perso");
        setIsLoading(false);
        console.log(res);
    }

    const [currentAllNetworkInterfaces, setCurrentAllNetworkInterfaces] = useState({});
    const [currentAllWifiInterfaces, setCurrentAllWifiInterfaces] = useState(undefined);
    const [toggleUpdate, setToggleUpdate] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        getAllNetworkInterfaces().then((interfacesObject) => {
            setCurrentAllNetworkInterfaces(interfacesObject);
        });
        getAllWifiInterfaces().then((wifiInterfaces) => {
            setCurrentAllWifiInterfaces(wifiInterfaces);
            console.log(wifiInterfaces[0][1]);

        });
    }, []);

    useEffect(() => {
        if (toggleUpdate !== undefined) {
            console.log("toggleUpdate", toggleUpdate);
            randomtime();
        }
    }, [toggleUpdate]);

    return (
        <div className={styles.container}>
            <Header isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}/>
                <div className={styles.appContent}>
                    <div className={styles.toggle}>
                        <Toggle isOn={true} onToggle={(state) => setToggleUpdate(state)} scale={3.8} disabled={isLoading}/>
                    </div>
                    <p>
                        {currentAllWifiInterfaces?.[0]?.[0]
                            ? `Default ${currentAllWifiInterfaces[0][0]} device selected`
                            : "Loading default network interface"
                        }
                    </p>
                    <p>
                        {currentAllWifiInterfaces?.[0]?.[1]
                            ? `Original macaddress: ${currentAllWifiInterfaces[0][1]}`
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