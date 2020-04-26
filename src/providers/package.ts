import { Provider } from '@poty/core'
import { FileProvider } from './fs';
import { AskProvider } from './ask';
import _ from 'lodash'
import inquirer from 'inquirer'

@Provider()
export class PackageProvider {

    constructor(
        private fs: FileProvider,
        private ask: AskProvider,
    ) { }

    async modify(dir: string) {
        let pkg = JSON.parse(await this.fs.readText(dir));
        let data = await inquirer.prompt([
            {
                type: "input",
                name: 'name',
                default: pkg.version,
                message: 'Project Name'
            },
            {
                type: "input",
                name: 'version',
                default: pkg.version,
                message: 'Version',
            },
            {
                type: 'input',
                name: 'description',
                default: pkg.description,
                message: 'Project Description'
            },
            {
                type: 'input',
                name: 'author',
                default: pkg.author,
                message: 'Author'
            },
            {
                type: 'input',
                name: 'repository',
                default: '',
                message: 'Project Repository',
            },
            {
                type: 'input',
                name: 'bugs',
                default: '',
                message: 'Bug Report'
            }
        ])
        pkg = _.defaultsDeep(pkg, {
            name: data.name,
            version: data.version,
            description: data.description,
            repository: {
                type: 'git',
                url: data.repository,
            },
            author: data.author,
            bugs: {
                url: data.bugs
            }
        })
        this.fs.saveText(dir, JSON.stringify(pkg, null, 4))
    }

}