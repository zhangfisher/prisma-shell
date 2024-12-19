import { program } from 'commander'
import type { PrismaShellOptions } from '../types'
import { PrismaShell } from '../shell'



program
    .name('prisma-shell')
    .version('0.0.1')
    .option('-p, --prisma-path <folder>', 'Prisma Path', './prisma')
    .action(async (options:PrismaShellOptions)=>{
        const shell = new PrismaShell(options)
        shell.start()
    })

program.parseAsync(process.argv)    