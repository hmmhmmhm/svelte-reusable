import { AxiosResponse } from 'axios'
import axios from 'axios'

/**
 * @description
 * A callback interface that contains the
 * communication code requested by the physical server.
 */
export type ProcessType = (link, header) => Promise<AxiosResponse<any>>

/**
 * @description
 * This is the required parameter
 * interface for network request.
 */
export interface IRequestParam {
    link: string
    process: ProcessType
    option?: IRequestOption
    processInfo: string
    header?: any
    axiosOption?: any
}

/**
 * @description
 * Optional interface available for network requests.
 */
export interface IRequestOption {
    /**
     * @description
     * Enabling this option prevents error fallback
     * from running in the event of a communication error.
     */
    noPreprocess: boolean

    /**
     * @description
     * When this option is enabled, fallback
     * does not check if it has the required
     * privileges for communication.
     */
    noAuthorization: boolean
}

export type PreprocessType = (params: IRequestParam) => boolean
export type IGlobalProcess = (
    params: IRequestParam
) => Promise<AxiosResponse<any>>
export type PostprocessType = (
    params: IRequestParam,
    response: AxiosResponse<any>
) => boolean

export class RestAPI {
    /**
     * @description
     * It should contain the back-end server address.
     */
    address: string = 'http://localhost'
    preprocess?: PreprocessType
    globalProcess: IGlobalProcess
    postprocess?: PostprocessType
    isUseAuth: boolean
    getToken: () => string
    faultTolerance?: (error: Error) => void

    constructor(params: {
        address: string
        isUseAuth: boolean
        getToken: () => string
        faultTolerance?: (error: Error) => void
        globalProcess?: IGlobalProcess
        preprocess?: PreprocessType
        postprocess?: PostprocessType
    }) {
        let {
            address,
            isUseAuth,
            getToken,
            faultTolerance,
            globalProcess,
            preprocess,
            postprocess,
        } = params
        this.address = address
        this.isUseAuth = isUseAuth
        this.getToken = getToken
        this.faultTolerance = faultTolerance
        if (globalProcess) this.globalProcess = globalProcess
        this.preprocess = preprocess
        this.postprocess = postprocess
        this.address = address

        if (!this.postprocess) this.postprocess = this.defaultPostProcess
        if (!this.globalProcess) this.globalProcess = this.defaultGlobalProcess
    }

    async request(params: IRequestParam) {
        let {
            link,
            process,
            option = {
                noPreprocess: false,
                noAuthorization: false,
            },
            processInfo = '',
            header,
            axiosOption,
        } = params

        try {
            if (!option.noPreprocess) {
                if (
                    typeof this.preprocess == 'function' &&
                    !this.preprocess(params)
                )
                    return undefined
            }

            let response = await this.globalProcess(params)

            if (
                typeof this.postprocess == 'function' &&
                !this.postprocess(params, response)
            )
                return undefined

            return response
        } catch (e) {
            if (typeof this.faultTolerance == 'function') this.faultTolerance(e)
            return undefined
        }
    }

    async safety({
        link,
        process,
        option,
        processInfo,
        header,
        axiosOption,
    }: {
        link: string
        process: ProcessType
        option?: IRequestOption
        processInfo?: string
        header?: any
        axiosOption?: any
    }) {
        return await this.request({
            link,
            process,
            option,
            processInfo: processInfo ? processInfo : '',
            header,
            axiosOption,
        })
    }

    async safteRequest({
        link,
        process,
        option,
        data,
        processInfo,
        header,
        axiosOption,
    }: {
        link: string
        process: ((link, header) => Promise<AxiosResponse<any>>) &
            ((link, data, header) => Promise<AxiosResponse<any>>)
        option?: IRequestOption
        data?: any
        processInfo: string
        header?: any
        axiosOption?: any
    }) {
        return await this.safety({
            link,
            process: async (link, header) => {
                let response: AxiosResponse<any>
                if (data) {
                    response = await process(link, data, header)
                } else {
                    response = await process(link, header)
                }

                return response
            },
            option,
            processInfo,
            header,
            axiosOption,
        })
    }

    async get({
        link,
        option,
        header,
        axiosOption,
    }: {
        link: string
        option?: IRequestOption
        header?: any
        axiosOption?: any
    }) {
        return this.safteRequest({
            link,
            option,
            process: axios.get,
            processInfo: `GET ${option ? JSON.stringify(option) : ''}`,
            header,
            axiosOption,
        })
    }

    async put({
        link,
        data,
        option,
        header,
        axiosOption,
    }: {
        link: string
        data: any
        option?: IRequestOption
        header?: any
        axiosOption?: any
    }) {
        return this.safteRequest({
            link,
            option,
            process: axios.put,
            data,
            processInfo: `PUT ${option ? JSON.stringify(option) : ''}`,
            header,
            axiosOption,
        })
    }

    async delete({
        link,
        option,
        header,
        axiosOption,
    }: {
        link: string
        option?: IRequestOption
        header?: any
        axiosOption?: any
    }) {
        return this.safteRequest({
            link,
            option,
            process: axios.delete,
            processInfo: `DELETE ${option ? JSON.stringify(option) : ''}`,
            header,
            axiosOption,
        })
    }

    async post({
        link,
        data,
        option,
        header,
        axiosOption,
    }: {
        link: string
        data: any
        option?: IRequestOption
        header?: any
        axiosOption?: any
    }) {
        return this.safteRequest({
            link,
            option,
            process: axios.post,
            data,
            processInfo: `POST ${option ? JSON.stringify(option) : ''}`,
            header,
        })
    }

    protected defaultGlobalProcess: IGlobalProcess = async params => {
        let {
            link,
            process,
            option = {
                noPreprocess: false,
                noAuthorization: false,
            },
            processInfo = '',
            header,
            axiosOption,
        } = params

        let token = this.getToken()
        let processLink = `${this.address}${link}`

        let processHeader = {}

        processHeader = {
            ...processHeader,

            ...(option.noAuthorization ||
            typeof token == 'string' &&
            token.length == 0
                ? {}
                : { headers: { Authorization: `Bearer ${token}` } }),

            ...(axiosOption ? axiosOption : {}),
        }
        //...(header ? header : {}),
        if (processHeader && header) {
            if (processHeader['headers']) {
                processHeader['headers'] = {
                    ...processHeader['headers'],
                    ...header,
                }
            }
        }

        let response = await params.process(processLink, processHeader)

        return response
    }

    protected defaultPostProcess: PostprocessType = (params, response) => {
        console.log(
            `%c🚧  ${params.link} ${params.processInfo}`,
            'color: #908CFF;',
            response
        )
        return true
    }

    protected defaultPreProcess: PreprocessType = params => {
        if (
            params.option &&
            this.isUseAuth &&
            !params.option.noAuthorization &&
            typeof this.getToken == 'function'
        ) {
            let token = this.getToken()
            let tokenIsValid = typeof token == 'string' && token.length > 0
            if (!tokenIsValid) return false
        }

        return true
    }
}
