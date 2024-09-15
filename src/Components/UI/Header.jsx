import styles from './header.module.css';
import line from './line.png';

const Header = () => {
    return (
        <header className={styles.header}>
            <img className={styles.img} src={line} alt='...'/>
        </header>
    );
}


export default Header;
