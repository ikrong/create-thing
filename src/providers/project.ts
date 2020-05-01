import { Provider } from '@poty/core'
import { ClientProvider } from './client'
import { AskProvider } from './ask'
import { FileProvider } from './fs'
import { ProjectInfo } from '../interfaces/project'
import path from 'path'
import chalk from 'chalk'
import url from 'url'
import osLocale from 'os-locale'
import { PackageProvider } from './package'
import { ShareProvider } from './share'

@Provider()
export class ProjectProvider {
    projects: ProjectInfo[] = []

    constructor(
        private client: ClientProvider,
        private fs: FileProvider,
        private ask: AskProvider,
        private pkg: PackageProvider,
        private share: ShareProvider,
    ) { }

    tmpdir: string = path.join(__dirname, './tmp/')

    async getConfig(): Promise<ProjectInfo[]> {
        // https://raw.staticdn.net/ikrong/starter/master/src/projects.json
        // https://raw.githubusercontent.com/ikrong/starter/master/src/projects.json
        // https://cdn.jsdelivr.net/gh/ikrong/starter@master/src/projects.json
        let configUrl = ''
        if (this.share.repository) {
            if (this.share.repository.slice(-5) == '.json') configUrl = this.share.repository
            else {
                if (this.share.repository.slice(-1) != '/') this.share.repository += '/'
                let projectUrl = url.resolve(this.share.repository, './projects.json')
                configUrl = this.share.repository ? `${projectUrl.toString()}` : ''
            }
        }
        return this.client.get(configUrl || `https://ikrong.github.io/starter/projects.json`)
    }

    async download(proj: ProjectInfo): Promise<string> {
        await this.del()
        let file = `${this.tmpdir}archive.zip`
        let unzipdir = `${this.tmpdir}archive/`
        let mainUrl = `https://github.com/ikrong/starter/archive/master.zip`
        let url = String(proj.type).toLowerCase() == 'github' ? proj.url : mainUrl
        await this.client.download(url, file)
        try {
            await this.fs.unzip(file, unzipdir)
        } catch (error) {
            throw console.log(chalk.redBright('不是压缩文件或者解压出错'))
        }
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
        try {
            loading.start('正在获取项目信息')
            this.projects = await this.getConfig()
            loading.stop()
            let locale = await osLocale()
            let isZh = locale.match(/^zh-/) ? true : false
            let choice = await this.ask.choose('选择项目模板:', this.projects.filter(item => {
                if (this.share.repository) {
                    return String(item.type).toLowerCase() == 'github'
                } else return true
            }).map(item => {
                return {
                    name: item.name,
                    desc: isZh ? item.lang.zh : item.lang.en,
                    extras: item
                }
            }))

            this.pullProject(choice.extras)
        } catch (error) {
            loading.stop()
            console.log(error)
        }
    }

    async pullProject(proj: ProjectInfo) {
        let loading = this.ask.loading()
        try {
            loading.start('获取项目中')
            let dir = await this.download(proj)
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
            console.log(`${chalk.green('接下来配置一下package.json,如果不需要配置可退出控制台')}`)
            await this.pkg.modify(path.join(workdir, 'package.json'))

            loading.stop()
        } catch (error) {
            console.log(error)
            loading.stop()
        }
    }

}