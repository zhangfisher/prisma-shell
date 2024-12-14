import type { PrismaShell } from "../shell";
import { formatRows } from "../../utils/formatRows";

export default function showObject(shell:PrismaShell){

    return  function(promise:any, ...args:any[]){
        const pageSize = 10;        
        shell.replServer.clearBufferedCommand();   
        setTimeout(()=>{
            process.stdout.write("\n");
        
        if(promise.then && typeof promise.then==='function'){
            promise.then((result)=>{
                if(Array.isArray(result)){
                    let pageNum = 1;
                    let fields;                    
                    // 解析参数
                    for(const arg of args) {
                        if(typeof arg === 'number') {
                            pageNum = arg;
                        } else if(typeof arg === 'string') {
                            fields = arg.split(',');
                        }
                    }                    
                    // 分页处理
                    const start = (pageNum - 1) * pageSize;
                    const end = start + pageSize;
                    const pagedResult = result.slice(start, end);
                    // 字段过滤
                    if(fields) {
                        const filteredResult = pagedResult.map(item => {
                            const filtered = {};
                            fields.forEach(field => {
                                filtered[field] = item[field];
                            });
                            return filtered;
                        });                            
                        console.table(formatRows.call(this,filteredResult), fields); 
                    } else {
                        console.table(formatRows.call(this,pagedResult)); 
                    }
                    shell.replServer.displayPrompt();                        
                } else {
                    console.log(result); 
                }
            }).catch((err)=>{
                console.error(err); 
            });
        } else {
            console.log(promise); 
            shell.replServer.displayPrompt();
        }  
        },0)        
        return ''
    }
    
}