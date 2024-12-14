import { program } from 'commander'
import type { PrismaShellOptions } from '../types'



program
    .name('prisma-shell')
    .version('0.0.1')
    .option('-p, --prisma-path', 'Prisma Path', './prisma')
    .action(async (options:PrismaShellOptions)=>{
        const { PrismaShell } = await import('../shell')
        const shell = new PrismaShell(options)
        shell.start()
    })

program.parseAsync(process.argv)    