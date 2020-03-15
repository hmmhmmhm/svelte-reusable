import { Readable, writable, get } from 'svelte/store'
import * as SPA from './spa'

// @ts-ignore
import * as _spaRouter from 'svelte-spa-router'

let referrer = writable('/')
let _preReferrer: string | undefined = undefined
_spaRouter.location.subscribe(currentLocation => {
    if (_preReferrer === undefined) {
        _preReferrer = currentLocation
        return
    }
    referrer.update(beforeValue => {
        if (_preReferrer !== undefined) return _preReferrer
        return beforeValue
    })
    _preReferrer = currentLocation
})

export interface ISPARouter {
    push: (link: string) => void
    link: (link: string) => void
    pop: () => void
    replace: (link: string) => void
    location: Readable<string>
    querystring: Readable<string>
}

let spaRouter: ISPARouter = _spaRouter

export const Router = {
    ...spaRouter,
    getLocation: () => get(spaRouter.location),
    getQueryString: () => get(spaRouter.querystring),
    once: SPA.once,
    setInterval: SPA.setInterval,
    setTimeout: SPA.setTimeout,

    referrer,
    getReferrer: () => get(referrer),
}
