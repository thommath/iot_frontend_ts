import { Album } from "./Types"

const fetchWrapper = async <T>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json() as T
}


type GetAlbumParams = {
    albumId: string | number;
}

export const getAlbum = ({ albumId }: GetAlbumParams) => fetchWrapper<Album>(`https://api.jottacloud.com/photos/v1/public/${albumId}`);
