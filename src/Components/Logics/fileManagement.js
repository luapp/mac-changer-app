import { exists, writeTextFile, readTextFile, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import { appDataDir } from '@tauri-apps/api/path';
import { getCurrentMacAddress } from './macAddressLogic';

export const createLocalSaveDir = async () => {
    try {
        await createDir('', {dir: BaseDirectory.AppData, recursive: true });
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
    const filePath = `${appDataPath}app_local_storage.dat`;
    const directoryExists = await exists(filePath);
    return directoryExists;
}

export const createSaveFile = async (filePath) => {
    try {
        const data = JSON.stringify({
            macAddressBackupStatus: false,
            macAddressBackup: 'null',
        }, null, 4);
        await writeTextFile(filePath, data);
        return 0;
    } catch (error) {
        console.error('Failed to save object:', error);
        return undefined;
    }
};

export const readSaveFile = async (filePath) => {
    try {
        const data = await readTextFile(filePath);
        const parsedData = JSON.parse(data);
        return parsedData;
    } catch (error) {
        console.error('Failed to read object:', error);
        return undefined;
    }
}

export const fetchOriginalMacAddressFromSaveFile = async (filePath) => {
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


export const writeOriginalMacAddressToSaveFile = async (filePath, parsedData) => {
    try {
        if (parsedData.macAddressBackupStatus === false) {
            const currentMac = await getCurrentMacAddress();
            if (currentMac !== undefined) {
                parsedData.macAddressBackup = currentMac;
                parsedData.macAddressBackupStatus = true;
                const newData = JSON.stringify(parsedData, null, 4);
                await writeTextFile(filePath, newData);
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


export const accessSaveFile = async () => {
    let savePathExists = await lookupLocalSaveDirPath();

    if (savePathExists) {
        const localSaveDirStatus = await createLocalSaveDir();
        if (localSaveDirStatus === undefined) {
            return undefined;
        }
        let saveFileExists = await lookupSaveFile();
        if (!saveFileExists) {
            const filePath = `${savePathExists}app_local_storage.dat`;
            const saveFileStatus = await createSaveFile(filePath);
            if (saveFileStatus === undefined) {
                return undefined;
            }
            const saveReadStatus = await readSaveFile(`${savePathExists}app_local_storage.dat`);
            if (saveReadStatus === undefined) {
                return undefined;
            }
            const writeMacBackupStatus = await writeOriginalMacAddressToSaveFile(`${savePathExists}app_local_storage.dat`, saveReadStatus);
            if (writeMacBackupStatus === undefined) {
                return undefined;
            }
        } else {
            const saveReadStatus = await readSaveFile(`${savePathExists}app_local_storage.dat`);
            if (saveReadStatus === undefined) {
                return undefined;
            }
        }
    } else {
        return undefined;
    }
    return `${savePathExists}app_local_storage.dat`;
}
