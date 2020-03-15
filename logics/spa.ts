// @ts-ignore
import { location } from 'svelte-spa-router'
import { get } from 'svelte/store'
let onceList = {}

location.subscribe(currentLocation => {
    for (let onceListKey of Object.keys(onceList))
        if (onceListKey != currentLocation) delete onceList[onceListKey]
})

/**
 * @description
 * This function allows the desired function
 * to operate only once within the page.
 * (This feature is applicable until a page move occurs.)
 */
export const once = (callback: () => void, identifier: string) => {
    let registeredLocation = get(location)

    if (
        typeof onceList[registeredLocation] == 'undefined' ||
        typeof onceList[registeredLocation][identifier] == 'undefined'
    ) {
        if (typeof onceList[registeredLocation] == 'undefined')
            onceList[registeredLocation] = {}
        onceList[registeredLocation][identifier] = true
        callback()
    }
}

/**
 * @description
 * This function will run the function repeatedly
 * only when no other page has been moved
 * from the first scheduled page.
 */
export const setInterval = (handler, timeout: number) => {
    let registeredLocation = get(location)
    let intervalHandler = setInterval(() => {
        if (get(location) != registeredLocation) {
            clearInterval(intervalHandler)
        } else {
            handler()
        }
    }, timeout)
    return intervalHandler
}

/**
 * @description
 * This function runs a callback only if no other
 * page has been moved from the first scheduled page.
 */
export const setTimeout = (handler, timeout: number) => {
    let registeredLocation = get(location)
    let timeoutHandler = setTimeout(() => {
        if (get(location) != registeredLocation) {
            clearTimeout(timeoutHandler)
        } else {
            handler()
        }
    }, timeout)
    return timeoutHandler
}
