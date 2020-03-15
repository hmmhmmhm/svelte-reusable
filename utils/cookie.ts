import { CookieStorage } from 'cookie-storage'

const cookieStorage = new CookieStorage()

export const clear = cookieStorage.clear
export const getItem = cookieStorage.getItem
export const key = cookieStorage.key
export const removeItem = cookieStorage.removeItem
export const setItem = cookieStorage.setItem
export const getCacheItem = tag => {
    let data = cookieStorage.getItem(tag)

    try {
        if (typeof data == 'string') {
            let parsed = JSON.parse(data)
            data = parsed
        }
    } catch (e) {}

    return data
}
