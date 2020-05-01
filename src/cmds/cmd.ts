import { CMD, Subcmd } from '@poty/commander'
import { ProjectProvider } from '../providers/project'
import chalk from 'chalk'

@CMD()
export class DefaultCMD {

    constructor(
        private project: ProjectProvider,
    ) { }

    @Subcmd()
    async default() {
        if (parseInt(process.versions.node.split('.')[0]) >= 10) {
            this.project.start()
        }else{
            console.log(chalk.redBright('需要node版本号10.X以上'))
        }
    }

}