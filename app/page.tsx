'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile, PhotoWithUser, FolderWithCount } from '@/types/database'
import type { SortOption } from '@/components/PhotoGrid'
import PhotoGrid from '@/components/PhotoGrid'
import PhotoUpload from '@/components/PhotoUpload'
import FolderGrid from '@/components/FolderGrid'
import CreateFolderModal from '@/components/CreateFolderModal'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [photos, setPhotos] = useState<PhotoWithUser[]>([])
  const [folders, setFolders] = useState<FolderWithCount[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<FolderWithCount | null>(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login')
    }
    if (user) {
      fetchAll()
    }
  }, [user, loading, router])

  const fetchAll = async () => {
    setLoadingData(true)
    await Promise.all([fetchProfile(), fetchFolders(), fetchPhotos()])
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

  const fetchFolders = async () => {
    const { data } = await supabase
      .from('folders')
      .select('*, profile:profiles(*)')
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
      .order('created_at', { ascending: false })
    if (data) setPhotos(data as PhotoWithUser[])
  }

  // Show loading while checking auth
  if (loading || loadingData || !profile) {
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
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentFolder(null)}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Our Memories</h1>
                <p className="text-sm text-gray-500">Welcome, {profile.name}! 💕</p>
              </div>
            </div>

            {/* Upload & Logout */}
            <div className="flex items-center gap-3">
              <PhotoUpload onUploadComplete={fetchAll} currentFolderId={currentFolder?.id ?? null}/>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                title="Sign out"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
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
            <span className='font-semibold text-gray-800'>{currentFolder.name}</span>
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
      />

      {/* Content */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhotoGrid photos={photos} loading={loadingPhotos} onRefresh={refreshPhotos} />
      </div> */}
      
    </main>
  )
}