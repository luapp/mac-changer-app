import { useEffect, useState } from 'react';
import { Command } from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';
import { appDataDir } from '@tauri-apps/api/path';
import { mac_adress_generator } from './MacAdress';
import { checkSaveFile } from './filesManagement'
import { writeTextFile, readTextFile, exists, createDir } from '@tauri-apps/api/fs';
import AppCss from './App.module.css';


function App() {
    const [NetworkInterfacesList, setNetworkInterfacesList] = useState('null');
    const [cmdOutErr, setCmdOutErr] = useState('null');
    const [macAddress, setMacAddress] = useState('');
    const [networkCardName, setNetworkCardName] = useState('null');
    const [output, setOutput] = useState('null');
    const [appDataPath, setAppDataPath] = useState('null');
    const [appDataSavePath, setAppDataSavePath] = useState('null');
    const [saveFileExists, setSaveFileExists] = useState(false);
    const [firstLaunch, setFirstLaunch] = useState("false");

    const handleRootNetworkExecution = (cardName) => {
        let macAdd = mac_adress_generator()

        if (cardName === 'null') {
            return;
        }
        if (macAdd === '') {
            return;
        }
        console.log(macAdd)
        invoke('auth_script_execution', {cardName, macAdd})
        .then((response) => {
            setOutput(response);
        })
        .catch((error) => {
            setOutput("Execution error");
            console.error(error);
            console.log(error)
        });
    };

    const ExtractNetworkCardName = (interfaceList) => {
        if (interfaceList === 'null' || interfaceList === 'ERROR') {
            if (interfaceList === 'ERROR') {
                setNetworkCardName('Error');
            } else {
                setNetworkCardName('null');
            }
            return;
        }
        const Match = interfaceList.match(/\(([^)]+)\)/);
        setNetworkCardName(Match[1]);
        return Match[1];
    }

    const NetworkInterfacesCommandExecution = async () => {
         try {
            const shellCommand = new Command('bash', ["-c", "networksetup -getairportpower $(system_profiler SPAirPortDataType | awk -F: '/Interfaces:/{getline; print $1;}')"]);
            const output = await shellCommand.execute();

            if (output.code === 0) {
                console.log(`stdout: ${output.stdout}`);
                setNetworkInterfacesList(output.stdout.trim());
                return output
            } else {
                console.error(`Command failed with code: ${output.code}`);
                setNetworkInterfacesList('ERROR');
                setCmdOutErr(output.stderr);
                return output
            }
        } catch (error) {
            console.error('Command execution failed:', error);
            setNetworkInterfacesList('ERROR');
            setCmdOutErr(error.message);
            return error
        }
    };



    const getAppDataPath = async () => {
        try {
            const appDataPath = await appDataDir();
            setAppDataPath(appDataPath);
        } catch (error) {
            setAppDataPath('Error');
        }
    }
/*
    const saveFileInit = async (filePath) => {
        setFirstLaunch("true");
        try {
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
*/
    const readSave = async () => {
        try {
            const data = await readTextFile(appDataSavePath);
            const parsedObject = JSON.parse(data);
            if (parsedObject.macAddressBackupStatus === false) {
                const currentMacAddress = await getCurrentMacAddress();
                if (currentMacAddress !== 'ERROR') {
                    parsedObject.macAddressBackup = currentMacAddress;
                    parsedObject.macAddressBackupStatus = true;
                    parsedObject.firstLaunch = false;
                    await writeTextFile(appDataSavePath, JSON.stringify(parsedObject, null, 4));
                }
            }

        } catch (error) {
            console.error('Failed to read object:', error);
        }
    };

    const getCurrentMacAddress = async () => {
        try {
            const shellCommand = new Command('bash', ["-c", "ifconfig $(networksetup -listallhardwareports | awk '/Hardware Port: Wi-Fi/{getline; print $2;}') | awk '/ether/{print $2;}'"]);
            const output = await shellCommand.execute();
            if (output.code === 0) {
                console.log(`stdout: ${output.stdout}`);
                return output.stdout.trim();
            } else {
                console.error(`Command failed with code: ${output.code}`);
                return 'ERROR';
            }
        }
        catch (error) {
            console.error('Command execution failed:', error);
            return 'ERROR';
        }
    }
/*
    const checkSaveFile = async () => {
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
                saveFileInit(filePath);
            }
        } catch (error) {
            console.error('Failed to check file:', error);
        }
    }
*/

    useEffect(() => {
        getAppDataPath();
    }, []);

    useEffect(() => {
        checkSaveFile(appDataPath, setSaveFileExists, setAppDataSavePath, setFirstLaunch);
    }, [appDataPath]);

    useEffect(() => {
        if (saveFileExists && appDataSavePath !== 'null') {
            readSave();
        }
    }, [saveFileExists, appDataSavePath]);


    const StartMACChanger = async () => {
        setNetworkCardName('null');
        setNetworkInterfacesList('null');
        setMacAddress('');

        try {
            let output = await NetworkInterfacesCommandExecution();
            if (output.code === 0) {
                let interfaceList = output.stdout.trim();
                let cardName = ExtractNetworkCardName(interfaceList);
                if (cardName !== 'null' && cardName !== 'Error') {
                    handleRootNetworkExecution(cardName);
                }
            } else {
                setNetworkCardName('Error');
            }
        }
        catch (error) {
            console.error(error);
            setNetworkCardName('Error');
        }

    }

    return (
        <div>
            <h1>Mac changer demo</h1>
            <h3>first launch {firstLaunch}</h3>
            <button onClick={StartMACChanger}>Run toggle</button>
            <button >Restore Mac</button>
            <p>stdout</p>
            <pre>{networkCardName}</pre>
            <br/>
            <p>stderr</p>
            <pre>{cmdOutErr}</pre>
            <br/>
            <p>{output}</p>
        </div>
    );
}

export default App;
