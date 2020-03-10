import { writable, get } from 'svelte/store'

let defaultHasLogin = false
let defaultToken = null

try {
    let load
    if ((load = window.localStorage.getItem('account.hasLogin')) != null)
        defaultHasLogin = load
    if ((load = window.localStorage.getItem('account.token')) != null) defaultToken = load
} catch (e) {
    console.log(e)
}

if (typeof defaultToken != 'string') defaultHasLogin = false

export const hasLogin = writable(defaultHasLogin)
hasLogin.subscribe(value => {
    window.localStorage.setItem('account.hasLogin', String(value))
})

export const tokenStore = writable(defaultToken)
tokenStore.subscribe(value => {
    window.localStorage.setItem('account.token', String(value))
})

export const getToken = () => get(tokenStore)
