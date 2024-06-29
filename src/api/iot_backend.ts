import { Firmware, FirmwareResponse } from "../types/FirmwareTypes";

// To get fetch to properly work with react query
const fetchWrapper = async <T>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    console.log(init)
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json() as T
}

const baseUrl = "https://iot.mashaogthomas.no/api/";

type BaseApiType = {
    token: string;
}

const apiWrapper = <T>(url: string, { token }: BaseApiType) =>
    fetchWrapper<T>(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })


export const getFirmware = (params: BaseApiType) => apiWrapper<FirmwareResponse>(baseUrl + "images", params);
