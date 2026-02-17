import { supabase } from "./supabase";

// -- Filename Helpers

function sanitize(str: string | undefined | null): string {
    if (!str) return ''
    return str.replace(/[^a-zA-Z0-9]/g, '')
}

export function buildFilename (
    photo: { file_name: string; created_at: string },
    albumName: string,
    folderName?: string | null
): string {
    const date = new Date(photo.created_at).toISOString().split('T')[0] // YYYY-MM-DD
    const ext = photo.file_name.split('.').pop() || 'jpg'
    const album = sanitize(albumName)
    const folder = folderName ? sanitize(folderName) : null
    return folder
        ? `${album}_${folder}_${date}.${ext}`
        : `${album}_${date}.${ext}`
}

// -- Get a fresh signed download URL

async function getDownloadUrl(storagePath: string): Promise<string> {
    const { data, error } = await supabase
        .storage
        .from('photos')
        .createSignedUrl(storagePath, 60) // 60 second expiry, enough to fetch

    if (error || !data?.signedUrl) throw new Error(`Failed to get download URL: ${storagePath}`)
    return data.signedUrl
}

// -- Single photo download

export async function downloadSinglePhoto(
    photo: { storage_path: string; file_name: string; created_at: string },
    albumName: string,
    folderName?: string | null,
): Promise<void> {
    const url = await getDownloadUrl(photo.storage_path)
    const response = await fetch(url)
    const blob = await response.blob()
    const filename = buildFilename(photo, albumName, folderName)

    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}

// -- Multi photo ZIP download

export async function downloadPhotosAsZip (
    photos: {storage_path: string; file_name: string; created_at: string }[],
    albumName: string,
    folderName?: string | null,
    onProgress?: (current: number, total: number) => void,
): Promise<void> {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        const url = await getDownloadUrl(photo.storage_path)
        const response = await fetch(url)
        const blob = await response.blob()
        const filename = buildFilename(photo, albumName, folderName)

        // Handle duplicate filenames (same date) by appending index
        const existing = zip.files[filename]
        const finalName = existing
            ? filename.replace(/(\.\w+)$/, `_${i + 1}$1`)
            : filename
        
        zip.file(filename, blob)
        onProgress?.(i + 1, photos.length)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipName = `${sanitize(albumName)}.zip`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(zipBlob)
    a.download = zipName
    a.click()
    URL.revokeObjectURL(a.href)
}