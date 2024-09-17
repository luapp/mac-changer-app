/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { platform } from '@tauri-apps/api/os';

export const checkOperatingSystem = async () => {
    try {
        const currentPlatform = await platform();
        if (currentPlatform === 'win32') {
            return 'Windows';
        } else if (currentPlatform === 'darwin') {
            return 'MacOS';
        } else if (currentPlatform === 'linux') {
            return 'Linux';
        } else {
            return 'Unknown';
        }
    } catch (error) {
        console.error('Failed to get operating system platform:', error);
        return undefined;
    }
};
