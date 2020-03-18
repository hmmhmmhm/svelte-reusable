// VirtualFileInput

type FileCallbackType = (
    event: {
        file: File
        thumbnail: string | ArrayBuffer | null
        getFormData: (name: string) => FormData
    } | void
) => void

type LimitCallbackType = (event: { size: number; sizeLimit: number }) => void

type NotSupportCallbackType = (event: {
    extension: string
    supportExtensions: string[]
}) => void

const getExtension = filename => {
    let parts = filename.split('.')
    return parts[parts.length - 1]
}
const isVideo = filename => {
    let ext = getExtension(filename)
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mp4':
        case 'mov':
        case 'mpg':
        case 'mpeg':
            // etc
            return true
    }
    return false
}

export const createThumbnail: (
    file: File,
    canvasElement
) => Promise<string | ArrayBuffer | null> = (file, canvasElement) => {
    return new Promise(async resolve => {
        try {
            if (isVideo(file.name)) {
                // Video Thumbnails
                if (canvasElement) {
                    //
                    let video = document.createElement('video')
                    const update = () => {
                        canvasElement
                            .getContext('2d')
                            .drawImage(
                                video,
                                0,
                                0,
                                video.videoWidth,
                                video.videoHeight
                            )
                    }

                    video.addEventListener(
                        'play',
                        async () => {
                            video.pause()

                            let ratio = video.videoWidth / video.videoHeight
                            let w = video.videoWidth - 100

                            // @ts-ignore
                            let h = parseInt(w / ratio, 10)
                            canvasElement.width = w
                            canvasElement.height = h

                            update()
                            // console.log(preCanvasElement.toDataURL("image/png"))
                            resolve(canvasElement.toDataURL('image/png'))
                        },
                        false
                    )
                    video.src = URL.createObjectURL(file)
                    video.autoplay = true
                    canvasElement.appendChild(video)
                }
            } else {
                // Image Thumbnails
                const reader = new FileReader()
                reader.onload = e => resolve(e.target?.result)
                reader.readAsDataURL(file)
            }
        } catch (e) {
            resolve(null)
        }
    })
}

export const addFileInputs = (
    param = {
        sizeLimit: 0,
        supportExtensions: ['*'],
    },
    count = 2
) => {
    let fileInputs: {
        element: HTMLInputElement
        open: () => void
        onChange: (newCallback: FileCallbackType) => void
        onLimit: (newCallback: LimitCallbackType) => void
        onNoSupport: (newCallback: NotSupportCallbackType) => void
        isFileSelected: () => boolean
        getFile: () => File | undefined
        getFormData: (name: string) => FormData
        reset: () => void
    }[] = []

    for (let i = 1; i <= count; i++) fileInputs.push(addFileInput(param))

    const getFiles = () => {
        let files: File[] = []
        for (let fileInput of fileInputs) {
            let file = fileInput.getFile()
            if (file) files.push(file)
        }
        return files
    }

    let elements: HTMLInputElement[] = []
    for (let fileInput of fileInputs) elements.push(fileInput.element)

    return {
        elements,
        fileInputs,
        open: () => {
            for (let fileInput of fileInputs) {
                if (!fileInput.isFileSelected()) {
                    fileInput.open()
                    break
                }
            }
        },
        onChange: (newCallback: FileCallbackType) => {
            for (let fileInput of fileInputs) fileInput.onChange(newCallback)
        },
        onLimit: (newCallback: LimitCallbackType) => {
            for (let fileInput of fileInputs) fileInput.onLimit(newCallback)
        },
        onNoSupport: (newCallback: NotSupportCallbackType) => {
            for (let fileInput of fileInputs) fileInput.onNoSupport(newCallback)
        },
        isFileSelected: () => {
            for (let fileInput of fileInputs)
                if (!fileInput.isFileSelected()) return false
            return true
        },
        fileSelectedCount: () => {
            let count = 0
            for (let fileInput of fileInputs)
                if (fileInput.isFileSelected()) count++
            return count
        },
        fileNotSelectedCount: () => {
            let count = 0
            for (let fileInput of fileInputs)
                if (!fileInput.isFileSelected()) count++
            return count
        },
        getFiles,
        getFormDatas: name => {
            let form = new FormData()
            let files = getFiles()
            for (let file of files) form.append(name, file)
            return form
        },
        reset: () => {
            for (let fileInput of fileInputs) fileInput.reset()
        },
    }
}
export const addFileInput = (
    param = {
        sizeLimit: 0,
        supportExtensions: ['*'],
    }
) => {
    let preContainer = document.createElement('div')
    preContainer.style.display = 'none'

    let container = document.body.appendChild(preContainer)
    let canvasElement: HTMLCanvasElement | undefined = undefined

    try {
        let preCanvasElement = document.createElement('canvas')
        canvasElement = container.appendChild(preCanvasElement)
    } catch (e) {}

    let fileInput = document.createElement('input')
    fileInput.type = 'file'

    let changeCallbacks: FileCallbackType[] = []
    let limitCallbacks: LimitCallbackType[] = []
    let noSupportCallbacks: NotSupportCallbackType[] = []

    let _isFileSelected = false
    fileInput.addEventListener('change', async (event: any) => {
        const { target } = event
        try {
            if (target.value.length > 0) {
                // file2InputElement.files[0]
                // enter(target.files)
                // fileInput.files[0]
                const file: File = target.files[0]

                // Size limit check
                if (param.sizeLimit != 0 && file.size > param.sizeLimit) {
                    for (let limitCallback of limitCallbacks)
                        if (typeof limitCallback == 'function')
                            limitCallback({
                                size: file.size,
                                sizeLimit: param.sizeLimit,
                            })
                    return
                }

                // Extension limit check
                let extension: string = getExtension(file.name)
                extension = extension.toLowerCase()
                let isExtensionAllAllowed =
                    param.supportExtensions.indexOf('*') !== -1
                if (!isExtensionAllAllowed) {
                    if (param.supportExtensions.indexOf(extension) === -1) {
                        // noSupportCallbacks
                        for (let noSupportCallback of noSupportCallbacks)
                            if (typeof noSupportCallback == 'function')
                                noSupportCallback({
                                    extension,
                                    supportExtensions: param.supportExtensions,
                                })
                        return
                    }
                }

                // Create Thumbnail
                const thumbnail = await createThumbnail(file, canvasElement)

                const getFormData = (name: string) => {
                    let form = new FormData()
                    form.append(name, file)
                    return form
                }

                for (let changeCallback of changeCallbacks)
                    if (typeof changeCallback == 'function')
                        changeCallback({ file, thumbnail, getFormData })

                _isFileSelected = true
            } else {
                for (let changeCallback of changeCallbacks)
                    if (typeof changeCallback == 'function') changeCallback()
                target.reset()
                _isFileSelected = false
            }
        } catch (e) {}
    })

    const element = container.appendChild(fileInput)
    const onChange: (newCallback: FileCallbackType) => void = newCallback =>
        changeCallbacks.push(newCallback)
    const onLimit: (newCallback: LimitCallbackType) => void = newCallback =>
        limitCallbacks.push(newCallback)
    const onNoSupport: (
        newCallback: NotSupportCallbackType
    ) => void = newCallback => noSupportCallbacks.push(newCallback)

    return {
        element,
        open: () => {
            element.click()
        },
        onChange,
        onLimit,
        onNoSupport,
        isFileSelected: () => _isFileSelected,
        getFile: () => {
            if (element.files?.length && element.files.length > 0) {
                return element.files[0]
            } else {
                return
            }
        },
        getFormData: (name: string) => {
            let form = new FormData()
            if (element.files?.length && element.files.length > 0)
                form.append(name, element.files[0])
            return form
        },
        reset: () => {
            try {
                element.value = ''
            } catch (e) {}
            try {
                element.type = 'text'
                element.type = 'file'
            } catch (e) {}
        },
    }
}

/*
let input1 = addFileInput({
    sizeLimit: 5 * 1024 * 1024,
    supportExtensions: ['*'],
})

input1.onChange(event => {
    if (event) {
        event.file
        event.thumbnail
        event.getFormData('thumbnail')
    }
})
input1.onLimit(event => {
    event.size
    event.sizeLimit
})
input1.onNoSupport(event => {
    event.extension
    event.supportExtensions
})

input1.open()

// 동기적 접근
input1.isFileSelected()
input1.getFile()
input1.getFormData('thumbnail')
*/
