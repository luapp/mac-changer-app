/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { Command } from '@tauri-apps/api/shell';

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

export const getCurrentMacAddress = async () => {
    try {
        const shellCommand = new Command('bash', ["-c", "ifconfig $(networksetup -listallhardwareports | awk '/Hardware Port: Wi-Fi/{getline; print $2;}') | awk '/ether/{print $2;}'"]);
        const output = await shellCommand.execute();
        if (output.code === 0) {
            console.log(`stdout: ${output.stdout}`);
            return output.stdout.trim();
        } else {
            console.error(`Command failed with code: ${output.code}`);
            return undefined;
        }
    }
    catch (error) {
        console.error('Command execution failed:', error);
        return undefined;
    }
}
