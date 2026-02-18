'use client'

import { Toaster } from "sonner"

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: 'white',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                },
            className: 'toast',
            }}
        />
    )
}