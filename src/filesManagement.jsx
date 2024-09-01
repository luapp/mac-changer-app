import { exists, writeTextFile, createDir, BaseDirectory } from '@tauri-apps/api/fs';


const saveFileInit = async (filePath, setFirstLaunch, setSaveFileExists, appDataPath) => {
    setFirstLaunch("true");
    try {
        await createDir('', {dir: BaseDirectory.AppData, recursive: true });
        const data = JSON.stringify({
            firstLaunch: false,
            macAddressBackupStatus: false,
            macAddressBackup: 'null',
        }, null, 4);
        await writeTextFile(filePath, data);
        setSaveFileExists(true);
    } catch (error) {
        console.error('Failed to save object:', error);
    }
};

export const checkSaveFile = async (appDataPath, setSaveFileExists, setAppDataSavePath, setFirstLaunch) => {
    if (appDataPath === 'null') {
        return;
    }
    try {
        const filePath = `${appDataPath}data_storage.dat`;
        setAppDataSavePath(filePath);
        const directoryExists = await exists(filePath);
        if (directoryExists) {
            setSaveFileExists(true);
        } else {
            saveFileInit(filePath, setFirstLaunch, setSaveFileExists, appDataPath);
        }
    } catch (error) {
        console.error('Failed to check file:', error);
    }
}
