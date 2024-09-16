import styles from './header.module.css';
import { useState, useEffect } from 'react';
import { Squash as Hamburger } from 'hamburger-react';

const Header = ({isSettingsOpen, setSettingsOpen}) => {
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
        </header>
    );
}

export default Header;
