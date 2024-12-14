export interface PrismaShellOptions{
    prompt?   : string,                             // 提示字符串， 默认是> 
    prismaPath: string
    context   : Record<string,any>                  // 上下文
}