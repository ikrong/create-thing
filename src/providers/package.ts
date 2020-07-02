import { Provider } from '@poty/core'
import { FileProvider } from './fs';
import _ from 'lodash'
import inquirer from 'inquirer'
import execa from 'execa'
import os from 'os'

@Provider()
export class PackageProvider {

    constructor(
        private fs: FileProvider,
    ) { }

    async modify(dir: string) {
        let pkg = JSON.parse(await this.fs.readText(dir));
        let user = (await this.whoami()).use
        let data = await inquirer.prompt([
            {
                type: "input",
                name: 'name',
                default: pkg.name,
                message: 'Project Name: '
            },
            {
                type: "input",
                name: 'version',
                default: pkg.version,
                message: 'Version: ',
            },
            {
                type: 'input',
                name: 'description',
                default: pkg.description,
                message: 'Project Description: '
            },
            {
                type: 'input',
                name: 'author',
                default: user || '',
                message: 'Author: '
            },
            {
                type: 'input',
                name: 'repository',
                default: '',
                message: 'Project Repository: ',
            },
            {
                type: 'input',
                name: 'bugs',
                default: '',
                message: 'Bug Report: '
            }
        ])
        pkg = _.defaultsDeep({
            name: data.name || pkg.name,
            version: data.version || pkg.version,
            description: data.description,
            repository: {
                type: 'git',
                url: data.repository || '',
            },
            author: data.author || '',
            bugs: {
                url: data.bugs || ''
            }
        }, pkg)
        if (!pkg?.bugs?.url) {
            delete pkg.bugs
        }
        if (!pkg?.repository?.url) {
            delete pkg.repository
        }
        return this.fs.saveText(dir, JSON.stringify(pkg, null, 4))
    }


    async whoami() {
        let npm = String(await execa('npm', ['whoami']).then(a => a.stdout, () => '')).trim()
        let git = String(await execa('git', ['config', 'user.name']).then(a => a.stdout, () => '')).trim()
        let local = os.userInfo().username

        return { npm, git, local, use: npm || git || local }
    }

}