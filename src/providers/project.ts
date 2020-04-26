import { Provider } from '@poty/core'
import { ClientProvider } from './client'
import { AskProvider } from './ask'
import { FileProvider } from './fs'
import { ProjectInfo } from '../interfaces/project'
import path from 'path'
import chalk from 'chalk'

@Provider()
export class ProjectProvider {
    projects: ProjectInfo[] = []

    constructor(
        private client: ClientProvider,
        private fs: FileProvider,
        private ask: AskProvider,
    ) { }

    tmpdir: string = path.join(__dirname, '../../tmp/')

    async getConfig(): Promise<ProjectInfo[]> {
        // https://raw.staticdn.net/ikrong/starter/master/src/projects.json
        // https://raw.githubusercontent.com/ikrong/starter/master/src/projects.json
        // https://cdn.jsdelivr.net/gh/ikrong/starter@master/src/projects.json
        return this.client.get('https://cdn.jsdelivr.net/gh/ikrong/starter@master/src/projects.json')
    }

    async download(proj: ProjectInfo): Promise<string> {
        await this.del()
        let file = `${this.tmpdir}archive.zip`
        let unzipdir = `${this.tmpdir}archive/`
        let url = String(proj.type).toLowerCase() == 'github' ? proj.url : 'https://github.com/ikrong/starter/archive/master.zip'
        await this.client.download(url, file)
        await this.fs.unzip(file, unzipdir)
        let dirs = await this.fs.dir(unzipdir)
        return path.resolve(unzipdir, dirs[0])
    }

    del() {
        return this.fs.del(this.tmpdir)
    }

    async start() {
        let loading = this.ask.loading()
        this.projects = await this.getConfig()
        if (this.projects.length <= 6) {
            loading.stop()
            let choice = await this.ask.choose('选择项目模板:', this.projects.map(item => {
                return {
                    name: item.name,
                    desc: item.lang.zh,
                    extras: item
                }
            }))
            loading.start('获取项目中')
            let dir = await this.download(choice.extras)
            loading.stop()
            let isCWD = await this.ask.confirm(`需要将项目创建在当前目录下吗 ${chalk.green(process.cwd())}`)
            console.log(dir, isCWD)
            loading.stop()

        }
    }

}