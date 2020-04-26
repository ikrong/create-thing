const i = require('inquirer')

i.prompt({
    type: 'list',
    name: 'choose',
    message: "请选择",
    choices: [
        '再见',
        {
            name: "你好",
            extra: { dd: 1 },
            value:'kk',
            short:'dafaf',
        }
    ]
}).then(console.log)