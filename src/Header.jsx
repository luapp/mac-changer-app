import styles from "./Header.module.css"

const Header = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mac Changer</h1>
            <h1 className={styles.settings}>Settings</h1>
        </div>
    );
}

export default Header;