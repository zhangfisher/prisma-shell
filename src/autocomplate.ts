import { REPLServer } from "node:repl"
import logsets from "logsets"

type AutoCompleteOptions = {
    prompt?:string, // 提示字符串
    /**
     * 按下TAB键时调用，获取下一个单词，并自动补全
     * @param word  当前已经输入的单词
     * @returns 返回补全
     */
    getNext?: (word: string) => string
    /**
     * 在当前输入行的前一行显示提示字符串，每一个字符串代表一个提示，之间用空格分隔
     * 并且使用灰色字体显示
     * @param word 
     * @returns 
     */
    getTips?: (word: string) => string[]

    getResult?: (word: string) => void
    history?: string[]
}


/**
 * 
 * 使用node:repl库，实现自动补全
 * 
 * 实现思路：
 * 1. 在输入时，按下TAB键时，调用getNext，将当前输入的单词作为参数,用来返回补全后的内容，如果返回空,则不会补全
 * 2. 在输入时，每输入一次就调用getTips，将当前输入的单词作为参数,用来返回提示字符串，如果返回空,则不会显示提示。提示字符串之间用空格分隔，并且使用灰色字体显示在输入行的前一行 * 
 * 3. prompt 是输入的提示字符串，显示在输入行的最前面，默认字符是>
 * 4. 输入完成后，按下回车键，结束输入，并调用回调函数getResult，将当前输入的单词作为参数，并将输入的单词添加到历史记录中
 * 5. 自动完全由输入行和提示行组成，输入行是当前输入的单词，提示行是提示字符串. 提示行显示在 输入行的前一行，并且使用灰色字体显示
 * 6. 在输入行，按左右键可以移动光标，按上下键可以切换历史记录，按删除键可以删除当前光标所在位置的字符，按退格键可以删除当前光标所在位置的前一个字符
 * 
 * 
 * @param prompt 
 * @param options 
 */
export function autocomplate(options?:AutoCompleteOptions) {
        const { prompt=">", getNext, getTips, getResult, history=[] } = Object.assign({},options) as Required<AutoCompleteOptions>
        const repl = require('repl')
        const replServer = repl.start({ prompt, 
            // eval: replEval ,
            completer: (line: string) => {
                const completions = '.help .error .exit .quit .q'.split(' ');
                const hits = completions.filter((c) => c.startsWith(line));
                // Show all completions if none found
                return [hits.length ? hits : completions, line];
            },
            writer: (output:any) => {
                return output
            }
        })
        replServer.context.x =1 
        // function replEval(cmd: string, context: any, filename: string, callback: (err: any, result: any) => void) {
        //     callback(null, eval(cmd))
        // }
        let c:number =1 
        // 每输入一个字符时触发的事件
        process.stdin.on('keypress', (key:any, meta:any) => {
            //{ sequence: 's', name: 's', ctrl: false, meta: false, shift: false }
            if(key==='.'){ 
                // 移移line里面\Suggestion:开始的所有字符
                const line = replServer.line.split("\n")[0]
                // s                 
                replServer.line = line +logsets.colors.darkGray("log\nSuggestion: aaaaa bbbbb ccccc"+c++) 
                replServer._refreshLine()
                
                // 刷新提示并移动光标到末尾
                // const pos = replServer.getCursorPos()
                // replServer.displayPrompt()
                // setTimeout(() => {.
                //     replServer._moveCursor(pos)
                // })
            
            }
        })
 
        replServer.defineCommand('exit', {
            help: 'Say hello',
            action(name:string) {
              this.clearBufferedCommand();
              console.log(`Hello, ${name}!`);
              this.displayPrompt();
            },
          });
          replServer.defineCommand('saybye', function saybye(this:REPLServer) {
            console.log('Goodbye!');
            this.close();
          }); 

}




autocomplate({
    getNext(word: string) {
        return word + 'abc'
    }
})