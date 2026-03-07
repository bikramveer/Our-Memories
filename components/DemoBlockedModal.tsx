'use client'

import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface DemoBlockedModalProps {
    isOpen: boolean,
    onClose: () => void
    actionName: string,
}

export default function DemoModalBlocked({ isOpen, onClose, actionName }: DemoBlockedModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleSignUp = () => {
        onClose()
        router.push('/signup')
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Demo Account Limitation</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium mb-2">
                                Demo accounts cannot {actionName}
                            </p>
                            <p className="text-gray-600 text-sm">
                                This is a read-only demo account. To access all features including uploading photos, creating albums, and managing folders, please create a free account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Continue Browsing
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        Sign Up Free
                    </button>
                </div>
            </div>
        </div>
    )
}