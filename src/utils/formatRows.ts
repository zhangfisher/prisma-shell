import type { PrismaShell } from "../shell/shell";


function truncateString(str:string, maxLength:number=10){
    return str.length > maxLength ? `${str.substring(0,maxLength)}...` : str
}

function formatDatetime(datetime:Date){
    if(!datetime) return 'null'
    const year = datetime.getFullYear()
    const month = (datetime.getMonth() + 1).toString().padStart(2,'0')
    const day = datetime.getDate().toString().padStart(2,'0')
    const hour = datetime.getHours().toString().padStart(2,'0')
    const minute = datetime.getMinutes().toString().padStart(2,'0') 
    const second = datetime.getSeconds().toString().padStart(2,'0')
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}


export function formatRows(this:PrismaShell,rows:any[]){
    // 处理字符串字段截断
    return rows.map(row => {
        const newRow = {...row};
        for(const key in newRow) {
            if(typeof newRow[key] === 'string') {
                newRow[key] = truncateString(newRow[key]);
            } else if(newRow[key] instanceof Date) {
                newRow[key] = formatDatetime(newRow[key]);
            }
        }
        return newRow;
    });
}