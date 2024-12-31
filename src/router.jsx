/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import App from "./App"
import Loading from "./Loading";
import {getOs} from "./logic/os";

const Router = () => {
    const [interfacesObjectState, setInterfacesObjectState] = useState({});
    const [currentOs, setCurrentOs] = useState(undefined);
    

    async function getAllNetworkInterfaces() {
        const interfaces = await invoke("get_all_network_interfaces");
        const lines = interfaces.split("\n").filter((line) => line.trim() !== "");
        const interfacesObject = {};
      
        for (let i = 0; i < lines.length; i += 3) {
            const key = Math.floor(i / 3);
            interfacesObject[key] = [
                lines[i] || null,
                lines[i + 1] || null,
                lines[i + 2] || null
            ];
        }
        setInterfacesObjectState(interfacesObject);
        return interfacesObject;
    }



    async function getAllWifiInterfaces() {
        const wifiInterfaces = await invoke("get_all_wifi_interfaces");
        console.log(wifiInterfaces);
    }

    useEffect(() => {
        getOs().then((osResult) => {
            setCurrentOs(osResult);
        });
        //getAllWifiInterfaces();
    }, []);

    if (currentOs === undefined) {
        return (
            <Loading />
        )
    } else {
        if (currentOs !== "macos") {
            return (
                <div>
                    <h1>Sorry, this app is only available on macOS</h1>
                </div>
            );
        } else {
            return (
                <App />
            );
        }
    }
}

export default Router;
