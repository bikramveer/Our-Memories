'use client'

import { useEffect } from "react"

interface ConfirmModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string,
    confirmText?: string,
    confirmStyle?: 'danger' | 'primary',
    loading?: boolean,
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    confirmStyle = 'danger',
    loading = false,
}: ConfirmModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onClose() 
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, loading, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 animate-fadeIn"
            onClick={loading ? undefined : onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`
                    w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center
                    ${confirmStyle === 'danger' ? 'bg-red-100' : 'bg-blue-100'}
                    `}>
                    {confirmStyle === 'danger' ? (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {title}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-6">
                    {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                        flex-1 py-3 rounded-full font-semibold text-white transition-colors disabled:opacity-50
                        ${confirmStyle === 'danger' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }
                        `}
                    >
                        {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                        </span>
                        ) : (
                        confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}