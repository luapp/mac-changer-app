/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { useState, useEffect } from "react";
import App from "./App"
import Loading from "./Loading";
import {getOs} from "./logic/os";

const Router = () => {
    const [interfacesObjectState, setInterfacesObjectState] = useState({});
    const [currentOs, setCurrentOs] = useState(undefined);

    useEffect(() => {
        getOs().then((osResult) => {
            setCurrentOs(osResult);
        });
    }, []);

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
            return (
                <App />
            );
        }
    }
}

export default Router;
