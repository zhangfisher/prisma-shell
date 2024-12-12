const vorpal = require("vorpal")()
const { PrismaClient } = require('@prisma/client')
  
  
vorpal
    .mode('repl')
    .delimiter('>')
    .init(function (args, callback) {
        this.log('Welcome to Prisma Shell.');
        this.log('Type exit to exit.');             
        this.log('Type `db` to access the PrismaClient instance.');
        global.db = new PrismaClient()
        callback();
    })
    .action(function (command, callback) {
        try{
            this.log(eval(command));
        }catch(e){
            this.log(e)
        }finally{
            callback()
        }                
    })

vorpal
    .show()
    .delimiter('')
    .parse(process.argv) 
  

vorpal.exec('repl')