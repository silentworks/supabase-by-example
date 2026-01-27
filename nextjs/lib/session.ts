import { cookies } from "next/headers";

export const passwordUpdateRequired = async () => {
    const cookieStore = await cookies()
    cookieStore.set('password_update_required', 'true')
}

export const clearPasswordUpdateCookie = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('password_update_required')
}
