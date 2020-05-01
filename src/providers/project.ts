import { Provider } from '@poty/core'
import { ClientProvider } from './client'
import { AskProvider } from './ask'
import { FileProvider } from './fs'
import { ProjectInfo } from '../interfaces/project'
import path from 'path'
import chalk from 'chalk'
import { PackageProvider } from './package'

@Provider()
export class ProjectProvider {
    projects: ProjectInfo[] = []

    constructor(
        private client: ClientProvider,
        private fs: FileProvider,
        private ask: AskProvider,
        private pkg: PackageProvider,
    ) { }

    tmpdir: string = path.join(__dirname, './tmp/')

    async getConfig(): Promise<ProjectInfo[]> {
        // https://raw.staticdn.net/ikrong/starter/master/src/projects.json
        // https://raw.githubusercontent.com/ikrong/starter/master/src/projects.json
        // https://cdn.jsdelivr.net/gh/ikrong/starter@master/src/projects.json
        return this.client.get(`https://cdn.jsdelivr.net/gh/ikrong/starter@${process.env.NODE_ENV == 'production' ? 'master' : 'dev'}/src/projects.json`)
    }

    async download(proj: ProjectInfo): Promise<string> {
        await this.del()
        let file = `${this.tmpdir}archive.zip`
        let unzipdir = `${this.tmpdir}archive/`
        let mainUrl = `https://github.com/ikrong/starter/archive/${process.env.NODE_ENV == 'production' ? 'master' : 'dev'}.zip`
        let url = String(proj.type).toLowerCase() == 'github' ? proj.url : mainUrl
        await this.client.download(url, file)
        await this.fs.unzip(file, unzipdir)
        let dirs = await this.fs.dir(unzipdir)
        let projectDir = ''
        switch (String(proj.type).toLowerCase()) {
            case 'github':
                break;
            default:
                projectDir = `packages/${proj.name}`
                break;
        }
        return path.resolve(unzipdir, dirs[0], projectDir)
    }

    del() {
        return this.fs.del(this.tmpdir)
    }

    async start() {
        let loading = this.ask.loading()
        this.projects = await this.getConfig()
        try {
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

                // 用户确认工作目录
                let workdir = process.cwd()
                let isCWD = await this.ask.confirm(`需要将项目创建在当前目录下吗 ${chalk.green(workdir)}`)
                if (!isCWD) {
                    workdir = await this.ask.input('请输入您需要创建项目的路径(绝对路径)', dir => path.isAbsolute(dir))
                }

                // 将模板复制到工作目录中
                loading.start('复制文件中')
                await this.fs.mkdir(workdir)
                await this.fs.copy([
                    path.join(dir, `/**/*`),
                    path.join(dir, `/**/.*`),
                    path.join(dir, `/**/.*/*`),
                    path.join(dir, `/**/.*/.*`),
                ], workdir, dir)
                loading.stop()

                // 提示修改package.json
                console.log(`${chalk.green('接下来配置一下package.json')}`)
                await this.pkg.modify(path.join(workdir, 'package.json'))

                loading.stop()
            }
        } catch (error) {
            loading.stop()
            console.log(error)
        }
    }

}