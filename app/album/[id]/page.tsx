'use client'

import { useAuth } from "@/components/AuthProvider"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Profile, PhotoWithUser, FolderWithCount, AlbumWithDetails} from '@/types/database'
import type { SortOption } from "@/components/PhotoGrid"
import { fetchUserAlbums } from "@/lib/albums"
import PhotoGrid from "@/components/PhotoGrid"
import PhotoUpload from "@/components/PhotoUpload"
import FolderGrid from "@/components/FolderGrid"
import CreateFolderModal from "@/components/CreateFolderModal"

export default function AlbumPage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const params = useParams()
    const albumId = params.id as string

    const [profile, setProfile] = useState<Profile | null>(null)
    const [album, setAlbum] = useState<AlbumWithDetails | null>(null)
    const [photos, setPhotos] = useState<PhotoWithUser[]>([])
    const [folders, setFolders] = useState<FolderWithCount[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [currentFolder, setCurrentFolder] = useState<FolderWithCount | null>(null)
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [sortOption, setSortOption] = useState<SortOption>('newest')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
            return
        }
        if (user && albumId) { fetchAll() }
    }, [user, loading, albumId])

    const fetchAll = async () => {
        if (!user) return
        setLoadingData(true)
        await Promise.all([fetchProfile(), fetchAlbum(), fetchFolders(), fetchPhotos()])
        setLoadingData(false)
    }

    const fetchProfile = async () => {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
    }

    const fetchAlbum = async () => {
        if (!user) return
        const albums = await fetchUserAlbums(user.id)
        const found = albums.find(a => a.id === albumId)
        if (!found) {
            router.push('/albums');
            return
        }
        setAlbum(found)
    }

    const fetchFolders = async () => {
      const { data } = await supabase
        .from('folders')
        .select('*, profile:profiles(*)')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true })
  
      if (data) {
        const foldersWithCount = await Promise.all(
          data.map(async (folder) => {
            const { count } = await supabase
              .from('photos')
              .select('*', { count: 'exact', head: true })
              .eq('folder_id', folder.id)
            return { ...folder, photo_count: count || 0}
          })
        )
        setFolders(foldersWithCount as FolderWithCount[])
      }
    }

    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false })
      if (data) setPhotos(data as PhotoWithUser[])
    }

        // Show loading while checking auth
    if (loading || loadingData || !profile || !album) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      )
    }

    // Photos shown depend on current view
    const visiblePhotos = currentFolder
    ? photos.filter(p => p.folder_id === currentFolder.id)
    : photos.filter(p => p.folder_id === null)

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                  {/* Dekstop - single row */}
                  <div className="hidden sm:flex items-center justify-between">
                    
                  </div>

                  {/* Mobile - double row */}
                  
                </div>
            </header>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Breadcrumb menu */}
                {currentFolder && (
                    <div className='flex items-center gap-2 mb-6 text-sm'>
                        <button
                            onClick={() => setCurrentFolder(null)}
                            className='flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors'
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            All Photos
                        </button>
                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                        <span className='font-semibold text-gray-800'>
                            {currentFolder.name}
                        </span>
                    </div>
                )}

                {/* Home View */}
                {!currentFolder && (
                  <>
                    <div className='mb-10'>
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-xl font-bold text-gray-800'>Folders</h2>
                        <button
                          onClick={() =>setShowCreateFolder(true)}
                          className='flex items-center gap-2 px-4 py-2 text-pink-500 border-2 border-pink-400 rounded-full hover:bg-pink-50 transition-colors font-semibold text-sm'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          New Folder
                        </button>
                      </div>
        
                      {folders.length === 0 ? (
                        <p className='text-gray-400 text-sm py-4'>
                          No folders yet - create one to organise your memories!
                        </p>
                      ) : (
                        <FolderGrid
                          folders={folders}
                          onFolderClick={setCurrentFolder}
                          onFolderDelete={fetchAll}
                        />
                      )}
                    </div>
        
                    {/* All Photos section */}
                    <div>
                      <h2 className='text-xl font-bold text-gray-800 mb-4'>All Photos</h2>
                      <PhotoGrid
                        photos={visiblePhotos}
                        folders={folders}
                        albumName={album.name}
                        currentFolder={null}
                        loading={false}
                        onRefresh={fetchAll}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                      />
                    </div>
                  </>
                )}
        
                {/* Folder view */}
                {currentFolder && (
                  <PhotoGrid
                    photos={visiblePhotos}
                    folders={folders}
                    albumName={album.name}
                    currentFolder={currentFolder.name}
                    loading={false}
                    onRefresh={fetchAll}
                    emptyMessage={`No photos in ${currentFolder.name} yet!`}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                  />
                )}
              </div>
        
              <CreateFolderModal
                isOpen={showCreateFolder}
                onClose={() => setShowCreateFolder(false)}
                onFolderCreated={fetchAll}
                albumId={albumId}
              />

        </main>
    )
}