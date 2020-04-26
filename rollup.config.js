import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import rm from 'rimraf'

rm.sync(`dist`)

export default {
    input: `src/index.ts`,
    output: [
        {
            file: `dist/index.js`,
            name: `create-thing`,
            format: 'cjs',
        }
    ],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: "esnext",
                }
            }
        }),
        commonjs(),
        json(),
        resolve({
            preferBuiltins: true,
        }),
    ],
    external: [
        'meow',
        'copy'
    ],
} 
