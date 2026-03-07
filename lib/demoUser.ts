export const DEMO_EMAIL = 'test@test.com'

export function isDemoUser(email: string | undefined): boolean {
    return email === DEMO_EMAIL
}

export function checkDemoUser(email: string | undefined): boolean {
    return isDemoUser(email)
}

export function blockDemoAction(email: string | undefined, actionName: string): boolean {
    if (isDemoUser(email)) {
        alert(`Demo accounts cannot ${actionName}. Sign up for a free account to try all features!`)
        return true
    }
    return false
}