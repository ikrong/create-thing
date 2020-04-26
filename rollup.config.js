import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import rm from 'rimraf'

rm.sync(`dist`)

export default {
    input: `src/index.ts`,
    output: [
        {
            file: `dist/index.js`,
            name: `create-thing`,
            format: 'umd'
        }
    ],
    plugins: [
        typescript(),
        commonjs(),
        json(),
    ],
    external: [
    ]
} 
