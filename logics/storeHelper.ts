import * as Store from 'svelte/store'

const getAllStoreData: <T>(data: T) => { [some in keyof T]: any } = data => {
    let parsed: any = {}
    for (let key of Object.keys(data)) {
        if (typeof data[key]['subscribe'] !== 'undefined') {
            parsed[key] = Store.get(data[key])
        } else {
            parsed[key] = data[key]
        }
    }
    return parsed
}

export const StoreHelper = {
    getAllStoreData,
}
