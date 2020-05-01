import { Provider } from '@poty/core'
import chalk from 'chalk'
import stringWidth from 'string-width'
import wrap from 'wrap-ansi'

@Provider()
export class BannerProvider {

    print() {
        let banner = [
            this.fill('='),
            this.fill(' '),
            this.center(
                this.colorfull('Help you start with an empty template project', [
                    chalk.redBright,
                    chalk.yellowBright,
                    chalk.greenBright,
                    chalk.cyanBright,
                    chalk.blackBright,
                    chalk.magentaBright,
                ]),
                '-'
            ),
            this.fill(' '),
            this.fill(' '),
            this.center(`Author ${chalk.greenBright('ikrong.com')}`, '*'),
            this.fill(' '),
            this.center(`Welcome to share your favorite template here`, '*'),
            this.center(`${chalk.blueBright('https://github.com/ikrong/create-thing')}`, '*'),
            this.fill(' '),
            this.fill('='),
        ]
        console.log(banner.join('\n'))
    }

    colorfull(text: string, fns: Function[]) {
        return text.split('').map((str, i) => fns[i % fns.length](str)).join('')
    }

    center(text: string, border: string = '') {
        let max = process.stdout.columns
        let textLen = this.width(text)
        let borderLen = this.width(border)
        let fill = max - (textLen + borderLen * 4)
        if (fill <= 0) {
            let line = Math.ceil(textLen / (max - (2 + (borderLen * 4))))
            let lineNum = Math.round(textLen / line)
            let lineText = wrap(text, lineNum, { hard: true }).split('\n')
            lineText = lineText.map((item: string) => this.center(item, border))
            return lineText.join('\n')
        }
        let left = Math.floor(fill / 2)
        let right = fill - left
        return String(' ').repeat(left) + `${border} ${text} ${border}` + String(' ').repeat(right)
    }

    width(str: string) {
        return stringWidth(str)
    }

    fill(text: string) {
        let maxWidth = process.stdout.columns
        return String(text).repeat(maxWidth).substr(0, maxWidth)
    }

}