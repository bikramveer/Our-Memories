'use client'

import { useState, useEffect } from 'react'
import { PhotoWithUser, CommentWithUser, FolderWithCount } from '@/types/database'
import { getPhotoUrl, deletePhoto } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import CommentSection from './CommentSection'
import MovePhotoModal from './MovePhotoModal'

interface PhotoModalProps {
  photo: PhotoWithUser
  folders: FolderWithCount[]
  isOpen: boolean
  onClose: () => void
  onPhotoDeleted: () => void
  onPhotoMoved: () => void
}

export default function PhotoModal({ photo, folders, isOpen, onClose, onPhotoDeleted, onPhotoMoved}: PhotoModalProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && photo) {
      fetchComments()
    }
  }, [isOpen, photo])

  const fetchComments = async () => {
    setLoadingComments(true)
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('photo_id', photo.id)
      .is('parent_id', null) // Only get top-level comments
      .order('created_at', { ascending: true })

    if (data) {
      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              profile:profiles(*)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })

          return {
            ...comment,
            replies: replies || []
          } as CommentWithUser
        })
      )

      setComments(commentsWithReplies)
    }
    setLoadingComments(false)
  }

  const handleDelete = async () => {
    if (!user || user.id !== photo.user_id) return
    
    const confirmed = confirm('Are you sure you want to delete this photo? This cannot be undone.')
    if (!confirmed) return

    setDeleting(true)
    try {
      // Delete from storage
      await deletePhoto(photo.storage_path)

      // Delete from database (comments will cascade delete automatically)
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)

      if (error) throw error

      onPhotoDeleted()
      onClose()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete photo')
    } finally {
      setDeleting(false)
    }
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    // Overlay - clicking anywehre here closes modal
    <div className='modal-overlay' onClick={onClose}>
      {/* Iner wrapper */}
      <div onClick={(e) => e.stopPropagation()}
        className='
          flex
          flex-col
          md:flex-row
          items-stretch
          rounded-xl
          overflow-hidden
          shadow-2xl
          w-full
          md:w-auto
          md:max-w-[90vw]
          max-h-[90vh]
          '
      >
        {/* Photo */}
        <div className='
          relative
          flex
          items-center
          justify-center
          bg-transparent
          overflow-hidden
          md:max-w-[65vw]
          flex-shrink-0
          '
        >
          <img
            src={getPhotoUrl(photo.storage_path)}
            alt={photo.file_name}
            className='
              block
              w-full
              md:w-auto
              md:h-auto
              md:max-h-[90vh]
              md:max-w-[40vw]
              max-h-[50vh]
              object-contain
              rounded-l-xl
              '
            />
        </div>

        {/* Sidebar */}
        <div className='
          w-full
          md:w-[380px]
          md:flex-shrink-0
          bg-white
          flex
          flex-col
          md:max-h-[90vh]
          max-h-[45vh]
          '
        >
          {/* Header */}
          <div className='
            p-4
            border-b
            border-gray-200
            flex
            items-center
            justify-between
            flex-shrink-0
            '
          >
            <div className='flex items-center gap-3'>
              <div className='
                w-10
                h-10
                rounded-full
                bg-gradient-to-br
                from-pink-500
                to-purple-500
                flex
                items-center
                justify-center
                text-white
                font-semibold
                '
              >
                {photo.profile?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className='font-semibold text-gray-800'>
                  {photo.profile?.name || 'Unknown'}
                </p>
                <p className='text-xs text-gray-500'>
                  {new Date(photo.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {/* Move button */}
              <button
                onClick={() => setShowMoveModal(true)}
                className='
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  text-gray-500
                  hover:text-white
                  hover:bg-gray-500
                  border
                  border-gray-300
                  rounded-lg
                  transition-colors
                '
                title='Move photo'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className='text-sm font-medium'>Move Photo</span>
              </button>

              {/* Delete Button (only for photo owner) */}
              {user && user.id === photo.user_id && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className='
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    text-red-500
                    hover:text-white
                    hover:bg-red-500
                    border
                    border-red-500
                    rounded-lg
                    transition-colors
                    '
                  title='Delete photo'
                >
                  {deleting ? (
                    <>
                      <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                        <path className='opacity-75' fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                      </svg>
                      <span className='text-sm'>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      <span className='text-sm font-medium'>Delete</span>
                    </>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className='flex-1 overflow-y-auto min-h-0'>
            <CommentSection
              photoId={photo.id}
              comments={comments}
              loading={loadingComments}
              onCommentAdded={fetchComments}
            />
          </div>
        </div>
      </div>

      {/* Move Photo Modal */}
      {showMoveModal && (
        <MovePhotoModal
          photos={[photo]}
          folders={folders}
          currentFolderId={photo.folder_id}
          isOpen={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMoved={() => {
            setShowMoveModal(false)
            onPhotoMoved()
            onClose()
          }}
        />
      )}
    </div>
  )
}