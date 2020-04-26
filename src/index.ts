import { Poty } from '@poty/core'
import { DefaultCMD } from './cmds/cmd'
import { ClientProvider } from './providers/client'
import { FileProvider } from './providers/fs'
import { AskProvider } from './providers/ask'
import { ProjectProvider } from './providers/project'
import { PackageProvider } from './providers/package'
import { UtilsProvider } from './providers/utils'

@Poty({
    entries: [
        DefaultCMD,
    ],
    providers: [
        ClientProvider,
        FileProvider,
        AskProvider,
        ProjectProvider,
        PackageProvider,
        UtilsProvider,
    ]
})
export class CreateApplication { }

Poty.run(CreateApplication);

process.on('uncaughtException', () => { });
process.on('unhandledRejection', () => {
    process.exit()
});
(<any>process).on('deprecation', () => { });
process.on('warning', () => { });