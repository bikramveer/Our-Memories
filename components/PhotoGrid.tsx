'use client';

import { useState } from "react";
import { PhotoWithUser } from "@/types/database";
import { getPhotoUrl } from "@/lib/storage";
import Image from "next/image";
import PhotoModal from "./PhotoModal";

interface PhotoGridProps {
    photos: PhotoWithUser[],
    loading: boolean,
    onRefresh: () => void,
};

export default function PhotoGrid({ photos, loading, onRefresh }: PhotoGridProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithUser | null>(null)

    if (loading) {
        return (
            <div className="
                flex
                items-center
                justify-center
                min-h-[400px]
                "
            >
                <div className="text-center">
                    <div className="
                        animate-spin
                        rounded-full
                        h-12
                        w-12
                        border-b-2
                        border-pink-500
                        mx-auto
                        mb-4
                        "
                    />
                    <p className="text-gray-600">
                        Loading photos...
                    </p>
                </div>
            </div>
        )
    }

    if (photos.length === 0) {
        return (
            <div className="
                flex
                items-center
                justify-center
                min-h-[500px]
                "
            >
                <div className="text-cetner max-w-md">
                    {/* heart icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="
                            w-24
                            h-24
                            rounded-full
                            bg-gradient-to-br
                            from-pink-200
                            to-purple-200
                            flex
                            items-center
                            justify-center
                            "
                        >
                            <svg 
                                className="w-12 h-12 text-pink-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex justify-center align-center">
                        No photos yet!
                    </h2>

                    <p className="text-gray-600 mb-6 flex justify-center align-center">
                        Let's start filling in our memories 💖
                    </p>

                    <p className="text-sm text-gray-500 flex justify-center align-center">
                        Click the{' '}<span className="text-pink-500 font-semibold">Upload</span>button above to add photos!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div>
                {/* <div className="mb-6">
                    <p className="text-gray-600">
                        {photos.length} {photos.length === 1 ? 'memory' : 'memories'} shared
                    </p>
                </div> */}

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-4
                    "
                >
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="photo-card group cursor-pointer"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <div className="
                                aspect-square
                                relative
                                overflow-hidden
                                rounded-lg
                                bg-gray-100
                                "
                            >
                                <Image
                                    src={getPhotoUrl(photo.storage_path)}
                                    alt={photo.file_name}
                                    fill
                                    className="
                                        object-cover
                                        transition-transform
                                        duration-300
                                        group-hover:scale-105
                                        "
                                    sizes="
                                        (max-width: 640px) 100vw,
                                        (max-width: 1024px) 50vw,
                                        (max-width: 1280px) 33vw,
                                        25vw
                                        "
                                />
                            </div>

                            <div className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/60
                                via-transparent
                                to-transparent
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                duration-300
                                rounded-lg
                                flex
                                items-end
                                p-4
                                "
                            >
                                <div className="text-white">
                                    <p className="font-medium text-sm">
                                        {photo.profile?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs opacity-90">
                                        {new Date(photo.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPhoto && (
                <PhotoModal
                    photo={selectedPhoto}
                    isOpen={!!selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                    onPhotoDeleted={() => {
                        setSelectedPhoto(null)
                        onRefresh()
                    }}
                />
            )}
        </>
    )
}