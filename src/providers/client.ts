import { Provider } from '@poty/core'
import superagent from 'superagent'
import { FileProvider } from './fs'

@Provider()
export class ClientProvider {

    constructor(
        private fs: FileProvider,
    ) { }

    async get(url: string) {
        return (await superagent.get(url)).body
    }

    async download(url: string, path: string) {
        return this.fs.saveBuffer((await superagent.get(url)).body, path)
    }

}