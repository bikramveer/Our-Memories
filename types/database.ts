// =====================================================
// DATABASE TYPES
// =====================================================
// TypeScript types matching our Supabase database schema
// These help with autocomplete and prevent bugs!
// =====================================================

export interface Profile {
    id: string                      // UUID from auth.users
    email: string
    name: string | null
    avatar_url: string | null
    created_at: string              // ISO date string
    updated_at: string              // ISO date string
}

export interface Folder {
    id: string
    name: string
    color: string
    user_id: string
    created_at: string
    updated_at: string
}

export interface Photo {
    id: string                      // UUID
    user_id: string                 // references Profile.id
    folder_id: string | null        // null = in All Photos
    storage_path: string            // path in supabase storage
    file_name: string
    file_size: number | null        // bytes
    mime_type: string | null        // jpeg, png, etc...
    created_at: string              // ISO date string
    updated_at: string              // ISO date string
}

export interface Comment {
    id: string                      // UUID
    photo_id: string                // refernces Photo.id
    user_id: string                 // references Profile.id
    parent_id: string | null        // references Comment.id (null if top level comment)
    content: string
    created_at: string              // ISO date string
    updated_at: string              // ISO date string
}

// =====================================================
// EXTENDED TYPES
// =====================================================

export interface FolderWithCount extends Folder {
    photo_count: number
    profile: Profile
}

export interface PhotoWithUser extends Photo {
    profile: Profile                // User who uploaded the photo
}

export interface CommentWithUser extends Comment {
    profile: Profile                // User who wrote the comment
    replies?: CommentWithUser[]     // Nested replies
}

export interface PhotoWithDetails extends Photo {
    profile: Profile                // User who uploaded Photo
    comments: CommentWithUser[]     // users who uploaded comments
    comment_count: number
}

// =====================================================
// FORM TYPES
// =====================================================

export interface NewPhoto {
    user_id: string
    folder_id?: string | null
    storage_path: string
    file_name: string
    file_size?: number
    mime_type?: string
}

export interface NewComment {
    photo_id: string
    user_id: string
    parent_id?: string | null
    content: string
}

export interface NewFolder {
    name: string
    color: string
    user_id: string
}

// =====================================================
// AUTH TYPES
// =====================================================

export interface SignUpData {
    email: string
    password: string
    name: string
}

export interface SignInData {
    email: string
    password: string
}