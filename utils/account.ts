import { writable, get, Writable } from 'svelte/store'

// Gets the data stored in the local storage.
let defaultHasLogin = false
let defaultToken = null
let defaultData = null
try {
    let load
    if ((load = window.localStorage.getItem('account.hasLogin')) != null)
        defaultHasLogin = load
    if ((load = window.localStorage.getItem('account.token')) != null)
        defaultToken = load
    if ((load = window.localStorage.getItem('account.data')) != null)
        defaultData = load
} catch (e) {
    console.log(e)
}

/**
 * @description
 * The user's authentication status is
 * recorded through the local storage.
 */
export const hasLogin = writable(defaultHasLogin)
hasLogin.subscribe(value => {
    window.localStorage.setItem('account.hasLogin', String(value))
})

export const getHasLogin = (): boolean => get(hasLogin)

/**
 * @description
 * The user's authentication tokens are
 * recorded through the local storage
 *
 * There is a security risk, please use
 * HttpOnly for important information.
 */
export const tokenStore: Writable<null | string> = writable(defaultToken)
tokenStore.subscribe(value => {
    window.localStorage.setItem('account.token', String(value))
})

export const getToken = (): null | string => get(tokenStore)

/**
 * @description
 * Data that needs to be automatically
 * stored on local storage can be
 * put here for easy use.
 */
export const dataStore: Writable<null | string> = writable(defaultData)
dataStore.subscribe(value => {
    window.localStorage.setItem('account.data', String(value))
})

export const getData = (): null | string => get(dataStore)
