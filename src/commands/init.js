const { Command } = require('commander'); 

const program = new Command();

program
    .action(async () => { 
       console.log("init")
    });



program.parseAsync(process.argv);
 