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
    const [newMacAddress, setNewMacAddress] = useState('null');
    const [currentMacAddress, setCurrentMacAddress] = useState('');
    const [originalMacAddress, setOriginalMacAddress] = useState('');
    const [networkCardName, setNetworkCardName] = useState('null');
    const [rustAuthExecutionOutput, setRustAuthExecutionOutput] = useState('null');
    const [appDataPath, setAppDataPath] = useState('null');
    const [appDataSavePath, setAppDataSavePath] = useState('null');
    const [saveFileExists, setSaveFileExists] = useState(false);
    const [firstLaunch, setFirstLaunch] = useState("false");
    const [activated, setActivated] = useState(false);
    const [activationRunning, setActivationRunning] = useState(false);

    const handleRootNetworkExecution = (cardName) => {
        let macAdd = ""
        console.log("ACTO"+activated)
        if (activated) {
            macAdd = mac_adress_generator()
            setNewMacAddress(macAdd);
        } else {
            macAdd = originalMacAddress;
            setNewMacAddress(macAdd);
        }

        if (cardName === 'null') {
            return;
        }
        if (macAdd === '') {
            return;
        }
        
        invoke('auth_script_execution', {cardName, macAdd})
        .then(() => {
            setRustAuthExecutionOutput("Executed");
        })
        .catch((error) => {
            setRustAuthExecutionOutput("Execution error");
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
                    setOriginalMacAddress(currentMacAddress)
                }
            }
            if (parsedObject.macAddressBackupStatus) {
                await getCurrentMacAddress();
                console.log("READING ORIGINA:")
                setOriginalMacAddress(parsedObject.macAddressBackup)
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
                setCurrentMacAddress(output.stdout.trim())
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
        initMacChanger()
    }, [activated])

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

    useEffect(() => {
        console.log("CURRENT>>>"+currentMacAddress)
        if (rustAuthExecutionOutput === "Executed" && currentMacAddress !== '') {
            if (activated && activationRunning) {
                if (currentMacAddress !== newMacAddress) {
                    setActivationRunning(false)
                }
            }
            if (!activated && activationRunning) {
                if (newMacAddress === originalMacAddress) {
                    console.log("RESTORE SUCCES")
                    setActivationRunning(false)
                }
                

            }
        }
    }, [rustAuthExecutionOutput, currentMacAddress])


    const stopMACChanger = async () => {
        console.log("stopping")

        try {
            let interfaceList = NetworkInterfacesList
            let cardName = ExtractNetworkCardName(interfaceList);
            if (cardName !== 'null' && cardName !== 'Error') {
                await getCurrentMacAddress()
                handleRootNetworkExecution(cardName);
            }
        }
        catch (error) {
            console.error(error);
            setNetworkCardName('Error');
        }
    }

    const StartMACChanger = async () => {
        setNetworkCardName('null');
        setNetworkInterfacesList('null');
        setCurrentMacAddress('');
        console.log("strarting")

        try {
            let output = await NetworkInterfacesCommandExecution();
            if (output.code === 0) {
                let interfaceList = output.stdout.trim();
                let cardName = ExtractNetworkCardName(interfaceList);
                if (cardName !== 'null' && cardName !== 'Error') {
                    await getCurrentMacAddress()
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

    const initMacChanger = () => {
        if (!activationRunning && activated) {
            setActivated(false);
            setActivationRunning(true)
            stopMACChanger();

        }
        if (!activationRunning && !activated) {
            setActivated(true);
            setActivationRunning(true)
            StartMACChanger();
        }
    }

    const toggle = () => {
        setActivated(!activated)
        console.log(activated)
    }

    return (
        <div>
            <h1>Mac changer demo</h1>
            <h3>first launch {firstLaunch}</h3>
            <button onClick={toggle}>Run toggle</button>
            <button >Restore Mac</button>
            <p>ACTO</p>
            <pre>{activated}</pre>
            <br/>
            <p>stderr</p>
            <pre>{cmdOutErr}</pre>
            <br/>
            <p>{rustAuthExecutionOutput}</p>
        </div>
    );
}

export default App;
