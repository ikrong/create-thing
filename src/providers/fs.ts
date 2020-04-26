import { Provider } from '@poty/core'
import fs from 'fs'
import p from 'path'
import mkdir from 'make-dir'
import uzip from 'extract-zip'
import rimraf from 'rimraf'

@Provider()
export class FileProvider {

    /**保存文件 */
    async saveBuffer(data: Buffer, path: string) {
        await this.mkdir(path)
        return new Promise((r, j) => {
            fs.writeFile(path, data, e => e ? j(e) : r())
        })
    }

    /**创建路径，存在则忽略 */
    mkdir(path: string) {
        let info = p.parse(path)
        return info.ext ? mkdir(info.dir) : mkdir(path)
    }

    /**解压zip文件 */
    async unzip(source: string, path: string) {
        await this.mkdir(path)
        return uzip(source, {
            dir: path
        })
    }

    /**删除文件或文件夹，可使用glob */
    del(path: string) {
        return new Promise((r, j) => {
            rimraf(path, e => e ? j(e) : r())
        })
    }

    /**列出文件夹下的文件列表 */
    dir(path: string): Promise<string[]> {
        return new Promise((r, j) => {
            fs.readdir(path, (e, dirs) => e ? j(e) : r(dirs))
        })
    }

    /**读取文本 */
    readText(path: string): Promise<string> {
        return new Promise((r, j) => {
            fs.readFile(path, (e, file) => e ? j(e) : r(file.toString()))
        })
    }

    /**保存文本 */
    saveText(path: string, data: string): Promise<void> {
        return new Promise((r, j) => {
            fs.writeFile(path, data, (e) => e ? j(e) : r())
        })
    }
}