import styles from './Settings.module.css';

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

export default Settings;
