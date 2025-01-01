/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import styles from "./App.module.css"
import Header from "./Header"
import {useState, useEffect} from "react"
import {getAllNetworkInterfaces, getAllWifiInterfaces} from "./logic/network"
import Toggle from "./Toggle"

const App = () => {

    const [currentAllNetworkInterfaces, setCurrentAllNetworkInterfaces] = useState({});
    const [currentAllWifiInterfaces, setCurrentAllWifiInterfaces] = useState(undefined);

    useEffect(() => {
        getAllNetworkInterfaces().then((interfacesObject) => {
            setCurrentAllNetworkInterfaces(interfacesObject);
        });
        getAllWifiInterfaces().then((wifiInterfaces) => {
            setCurrentAllWifiInterfaces(wifiInterfaces);
            console.log(wifiInterfaces[0][1]);

        });
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.appContent}>
                <div className={styles.toggle}>
                    <Toggle isOn={true} onToggle={(state) => console.log('New state:', state)} scale={3.8}/>
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
            </div>
        </div>
    );
}

export default App;