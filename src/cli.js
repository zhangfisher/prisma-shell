const { program } = require('commander'); 
const currentVersion = require("../package.json").version
const logsets = require("logsets")


program
    .name('prisma-shell')
    .version(currentVersion)
    .helpOption('-h, --help', '显示帮助')
    .option('-p, --prisma-path <path>', 'the Prisma folder path')
    .action(async () => {
        const banner = logsets.banner();
        banner.add("Prisma Shell")
        banner.add("command line interactive tools for prisma",{style:"darkGray"})
        banner.add() 
        banner.add("Version: {}",[currentVersion])        
        banner.render() 
    });
    
program
    .command('init','Init prisma shell',{executableFile:"./commands/init.js"})

program.parseAsync(process.argv);