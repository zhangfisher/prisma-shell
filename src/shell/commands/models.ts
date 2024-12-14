import type { PrismaShell } from "../shell";

export default function ModelsCommand(shell:PrismaShell){
    shell.replServer.defineCommand('models',{
        help: 'List all models',
        action(){
            this.clearBufferedCommand();
            console.log(Object.keys(shell.prismaClient._runtimeDataModel.models).join(","))            
            this.displayPrompt();
        }
    }) 

}