import styles from "./App.module.css"
import Header from "./Header"
import {useState, useEffect} from "react"
import {getOs} from  "./logic/os"

const App = () => {

    const [os, setos] = useState(null)

    return (
        <div className={styles.container}>
            <Header />
            <div>
                <h2>Activation:</h2>
                <button>OS Detection</button>
                <p>fd</p>
            </div>
        </div>
    );
}

export default App;