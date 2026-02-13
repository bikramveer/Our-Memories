'use client'

import { useState } from "react"
import { FolderWithCount } from "@/types/database"
import { useAuth } from "./AuthProvider"
import { supabase } from "@/lib/supabase"

interface FolderGridProps {
    folders: FolderWithCount[]
    onFolderClick: (folder: FolderWithCount) => void
    onFolderDelete: () => void;
}

export default function FolderGrid({ folders, onFolderClick, onFolderDelete }: FolderGridProps) {
    const { user } = useAuth()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (e: React.MouseEvent, folder: FolderWithCount) => {
        e.stopPropagation(); // don't open the folder

        const choice = confirm(
            `Delete "${folder.name}"?\n\nChoose OK to move all photos back to All Photos.\nChoose Cancel to keep the foler.`
        )
        if (!choice) return

        setDeletingId(folder.id)
        try {
            // Move all photos to main photo area
            await supabase
                .from('photos')
                .update({ folder_id: null })
                .eq('folder_id', folder.id)

            // Delete folder
            const { error } = await supabase
                .from('folders')
                .delete()
                .eq('id', folder.id)

            if (error) throw error

            onFolderDelete()
        } catch (err) {
            console.error('Delete folder errror:', err)
            alert('Failed to delete folder')
        } finally {
            setDeletingId(null)
        }
    }

    if (folders.length === 0) return null

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map((folder) => (
                <div
                    key={folder.id}
                    className="relative group cursor-pointer"
                    onClick={() => onFolderClick(folder)}
                >
                    <div
                        className="aspect-square rounded-2xl flex flex-fol items-center justify-center p-4 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl"
                        style={{ background: folder.color }}
                    >
                        {/* Folder icon */}
                        <svg
                            className="w-12 h-12 text-white mb-3 drop-shadow"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                            />
                        </svg>

                        {/* Folder Info */}
                        <p className="text-white font-bold text-center text-sm leading-tight drop-shadow">
                            {folder.name}
                        </p>
                        <p className="text-white/80 text-xs mt-1">
                            {folder.photo_count} {folder.photo_count === 1 ? 'photo' : 'photos'}
                        </p>

                        <p className="text-white/60 text-xs">
                            by {folder.profile?.name || 'Unknown'}
                        </p>
                    </div>

                    {/* Delete button - only shown to folder creator on hover */}
                    {user && user.id === folder.user_id && (
                        <button
                            onClick={(e) => handleDelete(e, folder)}
                            disabled={deletingId === folder.id}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                            title="Delete folder"
                        >
                            {deletingId === folder.id ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /> 
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}