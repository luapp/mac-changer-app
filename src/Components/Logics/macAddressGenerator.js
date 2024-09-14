export const mac_address_generator = () => {
    const getRandomHexPair = () => {
        return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    };
    let firstByte = Math.floor(Math.random() * 256);
    firstByte = firstByte & 0b11111110;
    const firstHexPair = firstByte.toString(16).padStart(2, '0');
    const macAddress = [
        firstHexPair,
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
        getRandomHexPair(),
    ].join(':');
    return macAddress.toLowerCase();
}
