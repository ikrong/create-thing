import { Poty } from '@poty/core'
import { DefaultCMD } from './cmds/cmd'
import { ClientProvider } from './providers/client'
import { FileProvider } from './providers/fs'
import { AskProvider } from './providers/ask'
import { ProjectProvider } from './providers/project'

@Poty({
    entries: [
        DefaultCMD,
    ],
    providers: [
        ClientProvider,
        FileProvider,
        AskProvider,
        ProjectProvider
    ]
})
export class CreateApplication { }

Poty.run(CreateApplication)