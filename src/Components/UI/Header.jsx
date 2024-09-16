import styles from './header.module.css';
import { useState, useEffect } from 'react';
import { Squash as Hamburger } from 'hamburger-react';

const Header = () => {
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (isSettingsOpen) {
            setTitle("Settings");
        } else {
            setTitle("");
        }
    }, [isSettingsOpen]);

    return (
        <header className={styles.header}>
            <div className={styles.navButton}>
                <Hamburger
                    toggled={isSettingsOpen}
                    toggle={setSettingsOpen}
                    duration={0.3}
                    size={32}
                    color="#FFFFFF"
                />
            </div>
            <h2 className={styles.title}>{title}</h2>
            {isSettingsOpen && <Settings />}
        </header>
    );
}

const Settings = () => {
    return (
        <div className={styles.settings}>
            <ul className={styles.settingList}>
                <li>Manual MAC address input</li>
                <li>Check Original MAC address</li>
                <li>Contact Us</li>
                <br/>
                <li>This is a Beta version</li>
            </ul>
        </div>
    );
}

export default Header;
