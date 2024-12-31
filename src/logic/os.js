/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

import { invoke } from "@tauri-apps/api/core";

export async function getOs() {
    const os = await invoke("detect_os");
    return os;
}

export async function getArch() {
    const arch = await invoke("detect_arch");
    return arch;
}
