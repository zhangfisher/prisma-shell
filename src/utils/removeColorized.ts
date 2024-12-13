


export function removeColorized(str:string){
    // 移除ANSI转义序列
    return str.replace(/\u001b\[\d+m/g, '')
}