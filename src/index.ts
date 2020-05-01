import { Poty } from '@poty/core'
import { DefaultCMD } from './cmds/cmd'
import { ClientProvider } from './providers/client'
import { FileProvider } from './providers/fs'
import { AskProvider } from './providers/ask'
import { ProjectProvider } from './providers/project'
import { PackageProvider } from './providers/package'
import { UtilsProvider } from './providers/utils'
import { ShareProvider } from './providers/share'
import { BannerProvider } from './providers/banner'
import { CMDModule } from '@poty/commander'

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
        ShareProvider,
        BannerProvider,
    ],
    imports: [
        CMDModule.Config({
            version: require('./../package.json').version,
        })
    ]
})
export class CreateApplication {

    constructor(
        private banner: BannerProvider,
    ) {
        this.banner.print()
    }

}

Poty.run(CreateApplication);

process.on('uncaughtException', () => { });
process.on('unhandledRejection', () => {
    process.exit()
});
(<any>process).on('deprecation', () => { });
process.on('warning', () => { });
