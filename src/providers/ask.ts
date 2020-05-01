import inquirer from 'inquirer'
import { Provider } from '@poty/core'
import ora from 'ora'
import chalk from 'chalk'

@Provider()
export class AskProvider {

    /**命令行列表询问 */
    async choose<T>(title: string, list: {
        name: string;
        desc: string;
        extras: T;
    }[]): Promise<{
        name: string;
        desc: string;
        extras: T;
    }> {
        let choices = []
        list.map((item, i) => {
            choices.push({
                name: item.name,
                value: i,
            })
            if (item.desc) {
                choices.push({
                    name: chalk.gray(item.desc),
                    disabled: '*'
                })
            }
        })
        let i = (await inquirer.prompt({
            type: 'list',
            name: 'choose',
            message: title,
            choices: choices,
        })).choose
        return list[i]
    }

    async confirm(desc: string) {
        return (await inquirer.prompt({
            type: 'confirm',
            name: 'isYes',
            message: desc,
        })).isYes ? true : false
    }

    async input(desc: string, validator?: (data: string) => (boolean | Promise<boolean>)) {
        return (await inquirer.prompt({
            type: 'input',
            name: 'input',
            message: desc,
            validate: (data) => {
                return validator ? validator(data) : true
            }
        })).input
    }

    /**加载动画 */
    loading() {
        let loading = ora()
        return loading
    }

}