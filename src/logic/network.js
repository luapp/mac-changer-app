/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { invoke } from "@tauri-apps/api/core";

export async function getAllNetworkInterfaces() {
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
    return interfacesObject;
}

export async function getAllWifiInterfaces() {
    const wifiInterfaces = await invoke("get_all_wifi_interfaces");
    const lines = wifiInterfaces.split("\n").filter((line) => line.trim() !== "");
    const wifiInterfacesObject = {};

    for (let i = 0; i < lines.length; i += 2) {
        const key = Math.floor(i / 2);
        wifiInterfacesObject[key] = [
            lines[i] || null,
            lines[i + 1] || null
        ];
    }
    return wifiInterfacesObject;
}

export const macAddressGenerator = () => {
    const getRandomHexPair = () => {
        return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    };
    let firstByte = Math.floor(Math.random() * 256);
    firstByte = firstByte & 0b11111110;
    const firstHexPair = firstByte.toString(16).padStart(2, '0');
    const macAddress = [
        firstHexPair,
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
    ].join(':');
    return macAddress.toLowerCase();
}

export const macAddressUnicastCheck = (macAddress) => {
    const firstByte = parseInt(macAddress.split(':')[0], 16);
    if ((firstByte & 0b00000001) === 0b00000000) {
        return true;
    }
    return false;
}
