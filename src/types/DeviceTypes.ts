

export type Device = {
    id: string;
    owners: string[];
    password: never;

    program?: string;
    room?: string;

} & Record<string, string>

export type DeviceResponse = {
    clients: Device[];
}

export type AddDeviceDto = Device