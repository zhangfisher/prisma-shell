import type { PrismaShell } from '../shell/shell';
import path from 'node:path';
import fs from 'node:fs';

export function compressHistory(shell:PrismaShell) {
    const historyFile = path.join(shell.options.prismaPath,'.history')
    
    if(!fs.existsSync(historyFile)){
        return
    }
    // 读取历史文件内容
    const content = fs.readFileSync(historyFile, 'utf-8')
    
    // 按行分割并去重
    const lines = content.split('\n')
    const uniqueLines = [...new Set(lines)]
    
    // 重新写入文件
    fs.writeFileSync(historyFile, uniqueLines.join('\n'))
}