'use client'

import { useState } from "react"
import { FolderWithCount } from "@/types/database"
import { useAuth } from "./AuthProvider"
import { supabase } from "@/lib/supabase"
import FolderSettingsModal from "./FolderSettingsModal"

interface FolderGridProps {
    folders: FolderWithCount[]
    onFolderClick: (folder: FolderWithCount) => void
    onFolderDelete: () => void;
}

export default function FolderGrid({ folders, onFolderClick, onFolderDelete }: FolderGridProps) {
    const { user } = useAuth()
    const [settingsFolder, setSettingsFolder] = useState<FolderWithCount | null>(null)

    if (folders.length === 0) return null

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {folders.map((folder) => (
                    <div
                        key={folder.id}
                        className="relative group cursor-pointer"
                        onClick={() => onFolderClick(folder)}
                    >
                        {/* Folder Card */}
                        <div
                            className="aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl"
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

                        {/* Gear icon - only shown to folder creator on hover */}
                        {user && user.id === folder.user_id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSettingsFolder(folder)
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                title="Folder settings"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {settingsFolder && (
                <FolderSettingsModal
                    folder={settingsFolder}
                    isOpen={!!settingsFolder}
                    onClose={() => setSettingsFolder(null)}
                    onUpdated={() => {
                        setSettingsFolder(null)
                        onFolderDelete()
                    }}
                />
            )}
        </>
    )
}