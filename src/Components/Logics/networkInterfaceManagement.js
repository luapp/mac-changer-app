/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { Command } from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';

export const extractNetworkCardName = (interfaceList) => {
    if (interfaceList === undefined) {
        return undefined;
    }
    const networkInterface = interfaceList.match(/\(([^)]+)\)/);
    return networkInterface[1];
}

export const fetchNetworkInterface = async () => {
    try {
        const shellCommand = new Command('bash', ["-c", "networksetup -getairportpower $(system_profiler SPAirPortDataType | awk -F: '/Interfaces:/{getline; print $1;}')"]);
        const output = await shellCommand.execute();

        if (output.code === 0) {
            const networkInterface = extractNetworkCardName(output.stdout.trim());
            if (networkInterface === undefined) {
                console.error("Failed to extract network interface name...");
                return undefined;
            } else {
                console.log(`Network interface: ${networkInterface}`);
                return networkInterface;
            }
        } else {
            console.error(`Command failed with code: ${output.code}`);
            return undefined
        }
    } catch (error) {
        console.error('Command execution failed:', error);
        return undefined
    }
}

export const macAddressModifier = async (networkInterface, macAddress) => {
    if (networkInterface === undefined || macAddress === undefined) {
        console.error("Invalid network interface or MAC address...");
        return undefined;
    }
    try {
        const commandOutput = await invoke('mac_address_modifier', { networkInterface, macAddress });
        return commandOutput;
    } catch (error) {
        console.error('Rust Command execution failed:', error);
        return undefined;
    }
}