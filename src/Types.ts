export type Photo = {
    "content": "image"
    "file_url": string
    "filename": string
    "filesize": number
    "height": number
    "width": number
    "hidden": boolean
    "deleted": boolean
    "id": string
    "mimetype": "image/jpeg"
    "thumbnail_url": string
    "timestamp": string
}
export type Album = {
    "id": string
    "coverPhoto": Photo
    "photos": Photo[]
    "title": string
    "bytes": number
}