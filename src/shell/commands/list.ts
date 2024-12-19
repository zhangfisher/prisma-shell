import type { PrismaShell } from "../shell";
import { formatRows } from "../../utils/formatRows";
 

export default function ListModelCommand(shell:PrismaShell){
    shell.replServer.defineCommand('list',{
        help: 'List [pageNum] [field1,field2,...] records',
        action(cmds:string){ 
            this.clearBufferedCommand();
            const parts = cmds.split(/\s+/);
            let modelName = parts[0];
            let pageNum = 1;
            let fieldNames;
            const pageSize = 10;
            
            // 解析剩余参数
            for(let i=1; i<parts.length; i++) {
                const part = parts[i];
                if(!isNaN(Number(part))) {
                    pageNum = parseInt(part);
                } else {
                    fieldNames = part;
                }
            }

            if(modelName){
                const model = shell.prismaClient[modelName];
                if(model){
                    const query = model.findMany({
                        skip: (pageNum - 1) * pageSize,
                        take: pageSize,
                        select: fieldNames ? 
                            fieldNames.split(',').reduce((acc,field)=>({
                                ...acc,
                                [field]:true
                            }),{}) : undefined
                    })
                    query.then(rows=>{
                        if(!rows || rows.length === 0) {
                            console.log('No records found');
                            this.displayPrompt();
                            return;
                        }
                        const fields = fieldNames ? fieldNames.split(',') : Object.keys(rows[0]);
                        // 处理字符串字段截断
                        const truncatedRows = formatRows.call(this,rows);
                        // @ts-ignore
                        console.table(truncatedRows,fields)
                        this.displayPrompt();
                    })
                }else{
                    console.log(`Model ${modelName} not found`)
                    this.displayPrompt();
                }            
            }else{
                this.displayPrompt();
            } 
            
        }
    }) 
}
