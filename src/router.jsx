/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { useState, useEffect } from "react";
import App from "./App"
import Loading from "./Loading";
import {getOs} from "./logic/os";
import {lookupSaveFile, createLocalSaveDir, createSaveFile, readSaveFile, writeOriginalMacAddressToSaveFile } from "./logic/fileManagement";
import {getAllWifiInterfaces} from "./logic/network";

const Router = () => {
    const [interfacesObjectState, setInterfacesObjectState] = useState({});
    const [currentOs, setCurrentOs] = useState(undefined);

    useEffect(() => {
        getOs().then((osResult) => {
            setCurrentOs(osResult);
        });
    }, []);

    const localFileSystemInit = async () => {
        lookupSaveFile().then((result) => {
            if (!result) {
                createLocalSaveDir().then((result) => {
                    if (result === 0) {
                        console.log("Directory created");
                        createSaveFile().then((result) => {
                            if (result) {
                                getAllWifiInterfaces().then((wifiInterfaces) => {
                                    const originalMacAddress = wifiInterfaces[0][1];
                                    readSaveFile().then((readResult) => {
                                        if (readResult) {
                                            console.log("File read");
                                            writeOriginalMacAddressToSaveFile(readResult, originalMacAddress).then((writeResult) => {
                                                if (writeResult) {
                                                    console.log("File written");
                                                } else {
                                                    console.log("Failed to write file");
                                                }
                                            });
                                        } else {
                                            console.log("Failed to read file");
                                        }
                                    });
                                });
                            } else {
                                console.log("Failed to create file");
                                console.log(result)
                            }
                        });
                    } else {
                        console.log("Failed to create directory");
                    }
                });
            } else {
                console.log("File already exists");
            }
        });
    }

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
            localFileSystemInit();
            return (
                <App />
            );
        }
    }
}

export default Router;
