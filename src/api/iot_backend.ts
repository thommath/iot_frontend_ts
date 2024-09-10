import { isLocal } from "../AuthProvider";
import { AddDeviceDto, DeviceResponse } from "../types/DeviceTypes";
import { AddFirmwareDto, FirmwareResponse } from "../types/FirmwareTypes";

// To get fetch to properly work with react query
const fetchWrapper = async <T>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    console.log(init)
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json() as T
}

export const iotBackendBaseUrl = isLocal ? "http://iot.local.server/api/" : "https://iot.mashaogthomas.no/api/";

type PostApiType = {
    body: BodyInit | null | undefined;
    method: "GET" | "POST" | "DELETE";
    contentType: string;
}
type ApiAuth = {
    token: string;
}

type BaseApiType = ApiAuth & Partial<PostApiType>;

const apiWrapper = <T>(url: string, { token, method, body, contentType }: BaseApiType) => {
    const headers: Record<string, string> = {};
    headers["Authorization"] = `${token}`;
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return fetchWrapper<T>(url, {
        method,
        body,
        headers,
    })
}


export const getFirmware = (params: BaseApiType) => apiWrapper<FirmwareResponse>(iotBackendBaseUrl + "images", params);

type AddFirmwareType = BaseApiType & {
    data: AddFirmwareDto
}
export const addFirmware = (params: AddFirmwareType) => {
    const formData = new FormData();
    const { file, version, program, platform } = params.data;
    formData.append("files[]", file);
    formData.append("version", String(version));
    formData.append("program", program);
    formData.append("platform", platform);

    return apiWrapper<"ok">(iotBackendBaseUrl + "upload", {
        token: params.token,
        method: "POST",
        body: formData
    });
}

type DeleteFirmwareType = BaseApiType & {
    id: string
}
export const deleteFirmware = (params: DeleteFirmwareType) => apiWrapper<"ok">(iotBackendBaseUrl + "images/" + params.id, {
    token: params.token,
    method: "DELETE",
});



export const getDevices = (params: BaseApiType) => apiWrapper<DeviceResponse>(iotBackendBaseUrl + "clients", params);

type SaveDeviceType = BaseApiType & {
    data: AddDeviceDto
}

export const saveDevice = (params: SaveDeviceType) => apiWrapper<"OK">(iotBackendBaseUrl + "client", {
    token: params.token,
    body: JSON.stringify(params.data),
    method: "POST",
    contentType: "application/json",
});

type DeleteDeviceType = BaseApiType & {
    id: string
}
export const deleteDevice = (params: DeleteDeviceType) => {
    console.log(params)
    return apiWrapper(iotBackendBaseUrl + "client/delete", {
        token: params.token,
        body: JSON.stringify({ id: params.id }),
        method: "POST",
        contentType: "application/json",
    });
}
