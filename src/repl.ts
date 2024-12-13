/**
 * 
 *  
 * const repl = new AutoRepl({
 *      prompt: ">",        // 提示字符串
 *      on: ['.', /[\(\{\[]\s*["']+/],         // 触发自动补全建议的字符
 *      getSuggestions: ({
 *          cmd:"当前输入的命令",
 *          lastWord:"当前输入的最后一个单词，如.xxx,则为xxx",
 *      }) => {     // 获取建议 
 *          return ["a","b","c"]
 *      }
 * 
 * })
 * 
 * 
 * 
 * 👈 👉
 */


import repl, { REPLServer } from  "node:repl"
import type { Key } from "readline"
import logsets from "logsets"
import { removeColorized } from "./utils/removeColorized" 


export type TriggerType = 'property' | 'call' | 'member'  

export type AutoReplOptions = {
    prompt?:string,                             // 提示字符串， 默认是>
    triggers?:{                                 // 触发自动补全建议
        property? : string,                     // 属性触发自动补全建议,默认是.
        call?     : string,                     // 函数调用触发自动补全建议，默认是(
        member?   : string,                     // 成员访问触发自动补全建议，默认是[
    },            
    getSuggestions?: (cmd:string, lastWord:string) => string[]               // 获取建议
    
    context?:Record<string,any>,                            // REPL全局上下文
    getObjectProperties?: (obj:any) => string[]             // 获取对象属性
    getObject?: (cmd:string) => any             // 获取对象
}


export class AutoRepl{
    private _options:AutoReplOptions
    private _triggerType?:TriggerType
    private _curSuggestion?:string
    private _suggestions:string[] = []
    private _curObject?:any
    private _curObjectLine?:string
    private _curPart?:string    
    replServer!:REPLServer

    constructor(options?:AutoReplOptions){
        this._options = Object.assign({
            triggers:{
                property: ".",
                call    : "(",
                member  : "[",
            },
            context:{}
        },options)
    }    
    get options(){ return this._options! }
    start(){
        this.replServer = repl.start({
            prompt: this._options.prompt,
            eval: this._onEval.bind(this),
            // completer: this._onCompleter.bind(this),
        })   
        // @ts-ignore        
        this.replServer.context = this._options.context
        process.stdin.on('keypress', this._onPressKey.bind(this))
    }
    /**
     * 处理按键事件
     * 
     * @param str 按键字符
     * @param key 按键详细信息
     */
    private _onPressKey(char: string, key: Key): void {
        const line = this.replServer.line
        // 是否触发自动补全建议
        const pos = this.replServer.getCursorPos()
        const triggerType = this._getTriggerType(line.substring(0,pos.cols))        
        if(triggerType){
            this._triggerType = triggerType
            if(triggerType=='property'){
                this._onProperty(char, key)
            }else if(triggerType=='call'){
                
            }else if(triggerType=='member'){
                
            }
        }else{            
            if(this._triggerType=='property'){
                this._onInputProperty(char, key)
            }else if(this._triggerType=='call'){
                
            }else if(this._triggerType=='member'){
                
            }
        }
    }
    
    private getObject(path:string){
        if(typeof this.options.getObject ==='function'){
            return this.options.getObject(path)
        }else{
            return eval(path)
        }        
    }
    private _getObjectProperties(obj:any){
        if(typeof this.options.getObjectProperties ==='function'){
            return this.options.getObjectProperties(obj)
        }else{
            return Object.getOwnPropertyNames(obj)
        }
    }
    /**
     * 当触发.访问对象属性时，获取建议
     * @param char 
     * @param key 
     */
    private _onProperty(char: string, key: Key){
        const pos = this.replServer.getCursorPos()
        let newLine = this.replServer.line.split("\n")[0]
        const line = removeColorized(newLine)
        const beforeLine = line.substring(0,pos.cols)
        const afterLine = line.substring(pos.cols)
        
        this._curSuggestion = ''            // 当前补全建议
        this._suggestions = []               // 所有补全建议
        const obj = this.getObject(beforeLine.substring(0,pos.cols-1))
        if(obj){
            this._curObject = obj
            this._curObjectLine = beforeLine
            const suggestions = this._getObjectProperties(obj)             
            if(suggestions && suggestions.length>0){
                this._suggestions = suggestions
                const colorizedSuggestions = logsets.colors.darkGray(suggestions.join(' '))
                newLine= `${beforeLine}${afterLine}\n${colorizedSuggestions}`
                // @ts-ignore
                this.replServer.line = newLine
            }
        }        
    }
    private _onInputProperty(char: string, key: Key){        

    }
    /**
     * 解析当前输入的命令
     * 
     * @description
     * 
     * 使用this.options.autoComplete.on中的字符分割符,
     * 从line的最后开始匹配，如果匹配，则按此进行分割
     * 
     * 如：
     * 
     * - on =['.'] 
     * 
     * a.b.c  -->   ['a.b.c']
     * a.b.c.  -->   ['a.b.c','.']
     * 
     * 
     * 
     * 
     * - on =['.',/[\(\{\[]\s*["']+/] 
     * 
     * a.b.c(" -->  ['a.b.c','("']
     * a.b.c("aaa").x(" -->  ['a.b.c("aaa").x','("']
     * a.b.c("aaa").x("aa","dd") -->  ['a.b.c("aaa").x','("']
     * 
     */
    private _parseCurrentLine(){ 


    }
    /**
     * 
     * 返回当前输入的命令的触发类型
     * 取决于最近输入的字符，返回的类型为TriggerType
     * - property  访问属性
     * - call      调用函数
     * - member    访问成员
     * 
     * @param line  当前输入的命令
     * @param key   最近输入的字符
     */
    private _getTriggerType(line:string):TriggerType | undefined{
        const triggers = this.options.triggers
        if (!triggers || line.length<=1) return 
        for(let [type,condition] of Object.entries(triggers)){
            if (typeof condition === 'string') {
                if(line.endsWith(condition)){
                    return type as TriggerType
                }
            } 
        }
    }

    private _onEval(expression: string) {
        const ctx = this.options.context
        // 使用 eval 并包装在非严格模式的函数中
        const evalInNonStrict = `
            (function() { 
                with(${ctx}) { 
                    return ${expression}
                } 
            })
        `
        return eval(evalInNonStrict).call(ctx)
    }
    private _onCompleter(){

    } 

}