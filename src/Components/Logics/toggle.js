import { accessSaveFile, fetchOriginalMacAddressFromSaveFile } from "./fileManagement";
import { fetchNetworkInterface, macAddressModifier } from "./networkInterfaceManagement";
import { macAddressGenerator } from "./macAddressLogic";

export const executeActivationSteps = async ({setIsOn, setLoading, setCompletedSteps}) => {
    console.log("Activation steps initiated...");
    setLoading(true);
    setCompletedSteps(0);
    try {
        let networkInterfaceStatus = undefined;

        const stepFunctions = [
            async () => {
                const accessStatus = await accessSaveFile();
                if (accessStatus === undefined) {
                    console.error("Failed to access drive and create MAC address backup...");
                    return false;
                }
                const originalMacAddress = await fetchOriginalMacAddressFromSaveFile(accessStatus);
                console.log(`Original MAC address: ${originalMacAddress}`);
                if (originalMacAddress === undefined) {
                    console.error("Failed to fetch original MAC address...");
                    return false;
                }
                return true;
            },
            async () => {
                networkInterfaceStatus = await fetchNetworkInterface();
                if (networkInterfaceStatus === undefined) {
                    console.error("Failed to fetch network interface status...");
                    return false;
                }
                return true;
            },
            async () => {
                let randomMacAddress = undefined;
                randomMacAddress = macAddressGenerator();
                if (randomMacAddress === undefined) {
                    console.error("Failed to generate random MAC address...");
                    return false;
                }
                const randomMacAddressInjectionStatus = await macAddressModifier(networkInterfaceStatus, randomMacAddress);
                if (randomMacAddressInjectionStatus === undefined) {
                    console.error("Failed to inject random MAC address...");
                    return false;
                }
                return true;
            }
        ];
        for (let i = 0; i < stepFunctions.length; i++) {
            const stepSuccess = await stepFunctions[i]();
            if (!stepSuccess) {
                console.error(`Step ${i + 1} failed...`);
                setLoading(false);
                return;
            }
            setCompletedSteps(i + 1);
        }
        setIsOn(prev => !prev);
        setLoading(false);
    }
    catch (error) {
        console.error("An error occurred during the activation steps:", error);
        setLoading(false);
        return undefined;
    }
};

export const executeDeactivationSteps = async ({setIsOn, setLoading, setCompletedSteps}) => {
    console.log("Deactivation steps initiated...");
    setLoading(true);
    setCompletedSteps(0);
    try {
        let networkInterfaceStatus = undefined;
        let originalMacAddress = undefined;

        const stepFunctions = [
            async () => {
                const accessStatus = await accessSaveFile();
                if (accessStatus === undefined) {
                    console.error("Failed to access drive and create MAC address backup...");
                    return false;
                }
                originalMacAddress = await fetchOriginalMacAddressFromSaveFile(accessStatus);
                console.log(`Original MAC address: ${originalMacAddress}`);
                if (originalMacAddress === undefined) {
                    console.error("Failed to fetch original MAC address...");
                    return false;
                }
                return true;
            },
            async () => {
                networkInterfaceStatus = await fetchNetworkInterface();
                if (networkInterfaceStatus === undefined) {
                    console.error("Failed to fetch network interface status...");
                    return false;
                }
                return true;
            },
            async () => {
                let randomMacAddress = undefined;
                randomMacAddress = macAddressGenerator();
                if (randomMacAddress === undefined) {
                    console.error("Failed to generate random MAC address...");
                    return false;
                }
                const randomMacAddressInjectionStatus = await macAddressModifier(networkInterfaceStatus, originalMacAddress);
                if (randomMacAddressInjectionStatus === undefined) {
                    console.error("Failed to inject random MAC address...");
                    return false;
                }
                return true;
            }
        ];
        for (let i = 0; i < stepFunctions.length; i++) {
            const stepSuccess = await stepFunctions[i]();
            if (!stepSuccess) {
                console.error(`Step ${i + 1} failed...`);
                setLoading(false);
                return;
            }
            setCompletedSteps(i + 1);
        }
        setIsOn(prev => !prev);
        setLoading(false);
    }
    catch (error) {
        console.error("An error occurred during the activation steps:", error);
        setLoading(false);
        return undefined;
    }
}
