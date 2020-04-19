interface DeviceLayout {
    devices: number,
    rows: number,
    devices_per_row: number

}

export function LayoutFinder(numDevices: number): DeviceLayout {
    /*

    If anyone wants to find a O(1) function for this be my guest. I couldn't. This is O(n) because it must loop through
    all the previous values.

    Some information:

    - devices_per_row = ciel(devices/rows)

     */
    let rows = 1; // some constants, with one video we of course want one row of one device
    let devices_per_row = 1;

    for (let i = 2; i <= numDevices; i++) { // start with 2, we already did 1 as a constant
        if (numDevices > rows * devices_per_row) { // if the current layout works then we don't need to do anything
            if (rows === devices_per_row) { // this is just based on a pattern i found, not really sure why it works
                devices_per_row++;
            } else {
                rows++;
            }
        }
    }

    return { // object instead of an array so theres not confusion on the order of output
        devices: numDevices,
        rows: rows,
        devices_per_row: devices_per_row
    }
}
