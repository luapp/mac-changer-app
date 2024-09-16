import styles from './Settings.module.css';

const Settings = () => {
    return (
        <div className={styles.settings}>
            <ul className={styles.settingList}>
                <li className={styles.listElements}>Manual MAC address input</li>
                <li className={styles.listElements}>Check Original MAC address</li>
                <li className={styles.listElements}>Contact Us</li>
                <br/>
                <li className={styles.beta}>THIS IS A BETA VERSION AND DOSES NOT REPENSENT THE FINAL QUALITY OF THE PRODUCT</li>
            </ul>
        </div>
    );
}

export default Settings;
