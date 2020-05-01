#!/usr/bin/env node

if (!(parseInt(process.versions.node.split('.')[0]) >= 10)) {
    console.log('\u001b[91m需要node版本号10.X以上\u001b[39m')
} else {
    require('../dist/index.js')
}