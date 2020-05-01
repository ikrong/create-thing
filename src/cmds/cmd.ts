import { CMD, Subcmd, Flag, Description } from '@poty/commander'
import { ProjectProvider } from '../providers/project'
import { ShareProvider } from '../providers/share'
import { AskProvider } from '../providers/ask'
import { FileProvider } from '../providers/fs'
import chalk from 'chalk'
import path from 'path'

@CMD()
export class DefaultCMD {

    constructor(
        private project: ProjectProvider,
        private share: ShareProvider,
        private ask: AskProvider,
        private fs: FileProvider,
    ) { }

    @Subcmd()
    @Flag({ flag: 'repository', alias: 'r', description: '使用自定义项目配置文件', })
    async default(data: any) {
        if (data.r) {
            this.share.repository = data.r
            console.log(chalk.yellowBright(`仓库配置已设为: ${data.r}`))
        }
        if (parseInt(process.versions.node.split('.')[0]) >= 10) {
            this.project.start()
        } else {
            console.log(chalk.redBright('需要node版本号10.X以上'))
        }
    }

    @Subcmd('gen-config')
    @Description('在当前目录下创建一个默认配置文件')
    async genConfig() {
        if (await this.ask.confirm('是否在当前目录下创建一个默认配置文件？')) {
            this.fs.saveText(path.join(process.cwd(), './projects.json'), JSON.stringify([{
                name: "webpack-starter",
                type: "github",
                url: "https://github.com/wbkd/webpack-starter/archive/master.zip",
                lang: {
                    zh: "使用最新的Webpack构建你的前端项目！",
                    en: "A lightweight foundation for your next webpack based frontend project."
                },
                tags: ["webpack", "javascript"]
            }], null, 4))
        }
    }

}