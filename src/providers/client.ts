import { Provider } from '@poty/core'
import bent from 'bent'
import { FileProvider } from './fs'

@Provider()
export class ClientProvider {

    constructor(
        private fs: FileProvider,
    ) { }

    private request(times: number = 0, ...args: bent.Options[]): bent.RequestFunction<any> {
        [200, 301, 302, 303, 304, 307, 308].map(code => {
            if (!args.includes(code)) {
                args.push(code)
            }
        })
        return async (url: string, body?: bent.RequestBody, headers?: any) => {
            let res: bent.BentResponse = await bent(...args)(url, body, headers) as any
            if ([200, 304].includes(res.statusCode)) {
                return res
            }
            let redirectURL = (<any>res.headers).location
            if (redirectURL) {
                if (times < 10) {
                    return await this.request(++times)(redirectURL)
                } else {
                    throw new Error('Too many redirects!')
                }
            }
            return res
        }
    }

    async get(url: string): Promise<any> {
        let text = await (await this.request()(url)).text()
        try {
            return JSON.parse(text)
        } catch (error) {
            return text
        }
    }

    async download(url: string, path: string) {
        let buf = await (await this.request()(url)).arrayBuffer()
        return this.fs.saveBuffer(Buffer.from(buf), path)
    }

}