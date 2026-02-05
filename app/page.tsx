'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile, PhotoWithUser } from '@/types/database'
import PhotoGrid from '@/components/PhotoGrid'
import PhotoUpload from '@/components/PhotoUpload'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [photos, setPhotos] = useState<PhotoWithUser[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login')
    }

    // Fetch user profile
    async function fetchProfile() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
        }
      }
    }

    // Fetch all photos with user info
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setPhotos(data as PhotoWithUser[])
      }
      setLoadingPhotos(false)
    }

    if (user) {
      fetchProfile()
      fetchPhotos()
    }
  }, [user, loading, router])

  // Refresh photos after upload
  const refreshPhotos = async () => {
    setLoadingPhotos(true)
    const { data } = await supabase
      .from('photos')
      .select(`
        *,
        profile:profiles(*)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setPhotos(data as PhotoWithUser[])
    }
    setLoadingPhotos(false)
  }

  // Show loading while checking auth
  if (loading || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
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
              <PhotoUpload onUploadComplete={refreshPhotos} />
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhotoGrid photos={photos} loading={loadingPhotos} onRefresh={refreshPhotos} />
      </div>
    </main>
  )
}