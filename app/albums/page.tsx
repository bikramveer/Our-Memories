'use client'

import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchUserAlbums } from "@/lib/albums"
import { AlbumWithDetails } from "@/types/database"
import { getPhotoUrl } from "@/lib/storage"
import { supabase } from "@/lib/supabase"

import CreateAlbumModal from "@/components/CreateAlbumModal"
import JoinAlbumModal from "@/components/JoinAlbumModal"
import AlbumSettingsModal from "@/components/AlbumSettingsModal"

export default function AlbumsPage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const [albums, setAlbums] = useState<AlbumWithDetails[]>([])
    const [loadingAlbums, setLoadingAlbums] = useState(true)
    const [albumSelected, setAlbumSelected] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [showJoin, setShowJoin] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }
        if (user) { loadData() }
    }, [user, loading])

    const loadData = async () => {
        if (!user) return
        setLoadingAlbums(true)

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) setProfile(profileData)

        const data = await fetchUserAlbums(user.id)
        setAlbums(data)
        setLoadingAlbums(false)
    }

    if (loading || loadingAlbums) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to bg-pink-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your albums...</p>
              </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
            {/* header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    
                    <div className="flex items-center gap-3">  
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Your Albums</h1>
                            <p className="text-sm text-gray-500">Welcome, {profile?.name}! 💕</p>
                        </div>  
                    </div>

                    <button
                        onClick={signOut}
                        className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                        title='Sign out'
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Title Row */}
                <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Choose an album to view
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {albums.length === 0
                                ? "You're not in any albums yet"
                                : `You're sharing ${albums.length} ${albums.length === 1 ? 'album' : 'albums'} with `
                            }
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowJoin(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-pink-400 text-pink-500 font-semibold hover:bg-pink-50 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Join Album
                        </button>
                        
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity text-sm shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Album
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                {albums.length === 0 && (
                    <div className="text-center py-20">

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No albums yet
                        </h3>
                        <p className="text-gray-500 mb-8">
                            Create a new album or join one with an invite code
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowJoin(true)}
                                className="px-6 py-3 rounded-full border-2 border-pink-400 text-pink-500 font-semibold hover:bg-pink-50 transition-colors"
                            >
                                Join with Code
                            </button>
                            <button
                                onClick={() => setShowCreate(true)}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-md"
                            >
                                Create Album
                            </button>
                        </div>
                    </div>
                )}

                {/* Album Grid */}
                {albums.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {albums.map(album => (
                            <AlbumCard 
                                key={album.id}
                                album={album}
                                onOpen={() => router.push(`/album/${album.id}`)}
                                onRefresh={loadData}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateAlbumModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={(albumId) => router.push(`album/${albumId}`)}
            />

            <JoinAlbumModal
                isOpen={showJoin}
                onClose={() => setShowJoin(false)}
                onJoined={(albumId) => router.push(`/album/${albumId}`)}
            />

        </main>
    )
}

// --- Album Card

function AlbumCard({ album, onOpen, onRefresh }: {
    album: AlbumWithDetails;
    onOpen: () => void;
    onRefresh: () => void;
}) {
    const [hovered, setHovered] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const { user } = useAuth()

    const memberNames = album.members.map((m: any) => m.name).filter(Boolean).join(', ')

    return (
        <>
            <div
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={onOpen}
            >
                {/* Cover Photos */}
                <div 
                    className="relative h-52 overflow-hidden rounded-2xl will-change-transform"
                    style={{ background: album.theme_color }}
                >
                    {album.cover_photos.length > 0 ? (
                        <div className={`grid ${album.cover_photos.length  === 1 ? 'grid-cols-1' : 'grid-cols-2'} h-full gap-0.5`}>
                            {album.cover_photos.slice(0, 4).map((path, i) => (
                                <div
                                    key={i}
                                    className="relative overflow-hidden"
                                >
                                    <img
                                        src={(path)}
                                        alt=""
                                        className={`w-full h-full object-cover transition-all duration-300 ${hovered ? 'brightness-100' : 'brightness-75'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Settings wheel */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowSettings(true);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                {/* Card body */}
                <div className="p-5">
                    <h3
                        className="text-lg font-bold mb-3 transition-colors duration-200"
                        style={{
                            color: hovered ? 'var(--album-color)' : '#1f2937'
                        }}
                    >
                        {album.name}
                    </h3>

                    <div className="space-y-1.5 text-sm text-gray-500 mb-5">

                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {/* <span>Shared with {memberNames}</span> */}
                            {memberNames.length >= 2 ? (
                                <span>Not shared with anyone yet</span>
                            ) : (
                                <span>Shared with {memberNames}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{album.photo_count} {album.photo_count === 1 ? 'photo' : 'photos'}</span>
                        </div>

                        

                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                                Created {new Date(album.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onOpen() }}
                        className="w-full py-3 rounded-full text-white font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                        style={{
                            background: album.theme_color
                        }}
                    >
                        Open Album
                    </button>
                </div>
            </div>
            {/* Settings Modal Placeholder */}
            {showSettings && (
                <AlbumSettingsModal
                    album={album}
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    onUpdated={() => {
                        setShowSettings(false)
                        onRefresh()
                    }}
                    onDeleted={() => {
                        setShowSettings(false)
                        onRefresh()
                    }}
                    onLeft={() => {
                        setShowSettings(false)
                        onRefresh()
                    }}
                />
            )}
        </>
    )
}