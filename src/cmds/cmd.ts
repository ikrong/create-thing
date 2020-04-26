import { CMD, Subcmd } from '@poty/commander'
import { ProjectProvider } from '../providers/project'

@CMD()
export class DefaultCMD {

    constructor(
        private project: ProjectProvider,
    ) { }

    @Subcmd()
    async default() {
        this.project.start()
    }

}