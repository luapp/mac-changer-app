/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useState } from "react";


function App() {
    const [interfacesObjectState, setInterfacesObjectState] = useState({});

    async function getAllNetworkInterfaces() {
        const interfaces = await invoke("get_all_network_interfaces");
        const lines = interfaces.split("\n").filter((line) => line.trim() !== "");
        const interfacesObject = {};
      
        for (let i = 0; i < lines.length; i += 3) {
            const key = Math.floor(i / 3);
            interfacesObject[key] = [
                lines[i] || null,
                lines[i + 1] || null,
                lines[i + 2] || null
            ];
        }
        return setInterfacesObjectState(interfacesObject);
    }

  return (
    <main className="container">
        <button onClick={getAllNetworkInterfaces}>Button</button>
        <div>
        {Object.keys(interfacesObjectState).map((key) => (
            <div key={key}>
            <h2>{interfacesObjectState[key][0]}</h2>
            <p>{interfacesObjectState[key][1]}</p>
            <p>{interfacesObjectState[key][2]}</p>
            </div>
        ))}
      </div>
    </main>
  );
}

export default App;
