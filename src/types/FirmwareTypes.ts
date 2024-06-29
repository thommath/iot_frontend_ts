
export type FirmwareResponse = {
    updates: Firmware[]
}

export type Firmware = {
    id: string;
    version: number;
    size: number;
    date: number;
    platform: string;
    program: string;
}

export type AddFirmwareDto = {
    version: number;
    platform: string;
    program: string;
    file: File;
}