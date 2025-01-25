/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { exists, BaseDirectory, mkdir, writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

export const createLocalSaveDir = async () => {
    try {
        const path = await lookupLocalSaveDirPath();
        await mkdir(path, {dir: BaseDirectory.AppData, recursive: true });
        return 0;
    } catch (error) {
        console.error('Failed to create directory:', error);
        return undefined;
    }
}

export const lookupLocalSaveDirPath = async () => {
    try {
        const appDataPath = await appDataDir();
        return appDataPath;
    } catch (error) {
        console.error('Failed to get app data path:', error);
        return undefined;
    }
}

export const lookupSaveFile = async () => {
    const appDataPath = await lookupLocalSaveDirPath();
    const filePath = `${appDataPath}/app_local_storage.dat`;
    const directoryExists = await exists(filePath);
    return directoryExists;
}

export const createSaveFile = async () => {
    const appDataPath = await lookupLocalSaveDirPath();
    const filePath = `${appDataPath}/app_local_storage.dat`;
    try {
        let data = JSON.stringify(
            {
                macAddressBackup: "undefined",
            }, null, 4);
        await writeTextFile(filePath, data);
        return 1;
    }
    catch (error) {
        console.error('Failed to create file:', error);
        return null;
    }

};

export const readSaveFile = async () => {
    const appDataPath = await lookupLocalSaveDirPath();
    const filePath = `${appDataPath}/app_local_storage.dat`;
    try {
        const data = await readTextFile(filePath);
        console.log(data);
        const parsedData = JSON.parse(data);

        return parsedData;
    } catch (error) {
        console.error('Failed to read object:', error);
        return null;
    }
}

export const fetchOriginalMacAddressFromSaveFile = async () => {
    const appDataPath = await lookupLocalSaveDirPath();
    const filePath = `${appDataPath}/app_local_storage.dat`;
    try {
        const parsedData = await readSaveFile(filePath);
        if (parsedData === undefined) {
            return undefined;
        }
        return parsedData.macAddressBackup;
    } catch (error) {
        console.error('Failed to read object:', error);
        return undefined;
    }
}


export const writeOriginalMacAddressToSaveFile = async (parsedData, originalMac) => {
    const appDataPath = await lookupLocalSaveDirPath();
    const filePath = `${appDataPath}/app_local_storage.dat`;
    try {
        if (parsedData.macAddressBackup === "undefined") {
            if (originalMac !== undefined) {
                parsedData.macAddressBackup = originalMac;
                const newData = JSON.stringify(parsedData, null, 4);
                await writeTextFile(filePath, newData);
                return 1;
            }
        } else {
            return 0;
        }
    }
    catch (error) {
        console.error('Failed to write object:', error);
        return undefined;
    }
}


// export const accessSaveFile = async () => {
//     let savePathExists = await lookupLocalSaveDirPath();

//     if (savePathExists) {
//         const localSaveDirStatus = await createLocalSaveDir();
//         if (localSaveDirStatus === undefined) {
//             return undefined;
//         }
//         let saveFileExists = await lookupSaveFile();
//         if (!saveFileExists) {
//             const filePath = `${savePathExists}app_local_storage.dat`;
//             const saveFileStatus = await createSaveFile(filePath);
//             if (saveFileStatus === undefined) {
//                 return undefined;
//             }
//             const saveReadStatus = await readSaveFile(`${savePathExists}app_local_storage.dat`);
//             if (saveReadStatus === undefined) {
//                 return undefined;
//             }
//             const writeMacBackupStatus = await writeOriginalMacAddressToSaveFile(`${savePathExists}app_local_storage.dat`, saveReadStatus);
//             if (writeMacBackupStatus === undefined) {
//                 return undefined;
//             }
//         } else {
//             const saveReadStatus = await readSaveFile(`${savePathExists}app_local_storage.dat`);
//             if (saveReadStatus === undefined) {
//                 return undefined;
//             }
//         }
//     } else {
//         return undefined;
//     }
//     return `${savePathExists}app_local_storage.dat`;
// }
