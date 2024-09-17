/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import React, {useEffect, useState} from 'react';
import styles from './Settings.module.css';

const General = ({aboutMe, setAboutMe}) => {

    const toggleAboutMe = () => {
        setAboutMe(!aboutMe);
    }

    return (
        <ul className={styles.settingList}>
            <li className={styles.listElements}>Manual MAC address input</li>
            <li className={styles.listElements}>Check Original MAC address</li>
            <li className={styles.listElements}>Contact Me</li>
            <li className={styles.listElements} onClick={toggleAboutMe}>About Me</li>
            <br/>
            <li className={styles.beta}>THIS IS A BETA VERSION AND DOSES NOT REPENSENT THE FINAL QUALITY OF THE PRODUCT</li>
        </ul>
    );
}

const AboutMe = ({aboutMe, setAboutMe}) => {

    const toggleAboutMe = () => {
        setAboutMe(!aboutMe);
    }


    return (
        <div className={styles.aboutMe}>
            <ul className={styles.settingList}>
                <br/>
                <li className={styles.listElements}>By Paul Le Gall</li>
                <br/>
                <li className={styles.listElements}>© 2024 Paul Le Gall. All Rights Reserved.</li>
                <br/>
                <li className={styles.back} onClick={toggleAboutMe}>Go Back</li>
            </ul>
        </div>
    );
}

const Settings = () => {
    const [aboutMe, setAboutMe] = useState(false);


    return (
        <div className={styles.settings}>
            {aboutMe ? <AboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} /> : <General aboutMe={aboutMe} setAboutMe={setAboutMe} />}
        </div>
    );
}

export default Settings;
