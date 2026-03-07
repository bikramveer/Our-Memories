'use client'

import { createContext, useContext, useState, ReactNode } from "react"
import DemoModalBlocked from "./DemoBlockedModal"

interface DemoModalContextType {
    showDemoModal: (actionName: string) => void
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined)

export function DemoModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [actionName, setActionName] = useState('')

    const showDemoModal = (action: string) => {
        setActionName(action)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setActionName('')
    }

    return (
        <DemoModalContext.Provider value={{ showDemoModal }}>
            {children}
            <DemoModalBlocked
                isOpen={isOpen}
                onClose={closeModal}
                actionName={actionName}
            />
        </DemoModalContext.Provider>
    )
}

export function useDemoModal() {
    const context = useContext(DemoModalContext)
    if (!context) {
        throw new Error('useDemoModal must be used within DemoModalProvider')
    }
    return context
}