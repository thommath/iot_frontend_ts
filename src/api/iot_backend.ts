import { AddFirmwareDto, Firmware, FirmwareResponse } from "../types/FirmwareTypes";

// To get fetch to properly work with react query
const fetchWrapper = async <T>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    console.log(init)
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json() as T
}

export const iotBackendBaseUrl = "https://iot.mashaogthomas.no/api/";

type PostApiType = {
    body: BodyInit | null | undefined;
    method: "GET" | "POST" | "DELETE";
}
type ApiAuth = {
    token: string;
}

type BaseApiType = ApiAuth & Partial<PostApiType>;

const apiWrapper = <T>(url: string, { token, method, body }: BaseApiType) =>
    fetchWrapper<T>(url, {
        method,
        body,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })



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
