/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import React, { useState } from "react";
import Header from "./Components/UI/Header";
import Home from "./Components/UI/Home";
import Settings from "./Components/UI/Settings";
import styles from './App.module.css';

const App = () => {
    
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    
    return (
        <div className={styles.app}>
            <Header isSettingsOpen={isSettingsOpen} setSettingsOpen={setSettingsOpen}/>
            {isSettingsOpen ? <Settings /> : <Home />}
        </div>
    );
}

export default App;
