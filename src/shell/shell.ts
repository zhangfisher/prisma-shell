/**
 * 
 *    
 * 
 * 
 * 👈 👉
 */


import repl, { REPLServer } from  "node:repl"
import { PrismaShellOptions } from "../types"
import { getPackageRootPath } from "flex-tools/package/getPackageRootPath" 
import path from "node:path"
import fs from "node:fs"
import logsets from "logsets"
import registerModelsCommand from "./commands/models"
import registerListModelCommand from "./commands/list" 
import registerShowObject from "./contexts/showObject"
import { compressHistory } from "../utils/compressHistory"

export class PrismaShell{
    private _options:PrismaShellOptions 
    replServer!:REPLServer
    private _prismaClient:any

    constructor(options?:PrismaShellOptions){
        this._options = Object.assign({
            prismaPath: "./prisma",
        },options)
        this._loadConfig()
        this._prismaClient = this._createPrismaClient()  
        compressHistory(this)
    }    
    get prismaClient(){ return this._prismaClient }
    get prismaPath(){ return this._options.prismaPath }
    private _showLogo(){
        const banner = logsets.banner()
        banner.add("Prisma Shell")
        banner.add("")        
        banner.add("db|prisma      Access Prisma Client",[],{align:'left'}) 
        banner.add(".models        List Models",[],{align:'left'})
        banner.add(".list          List model data",[],{align:'left'})
        banner.add(".help          Show help",[],{align:'left'})
        banner.add(".exit          Exit",[],{align:'left'})
        banner.render()
        console.log("Available Models: ",this._getModels().join(", "))
        console.log("Type $<model> to access model instance, eg. $user")
    }
    private _getModels(){
        return Object.keys(this.prismaClient._runtimeDataModel.models)
    }

    
    private _createModelShortcuts(){
        const models = this._getModels()
        for(const model of models){
            // 处理驼峰命名,如 UserPost => userpost
            const modelName = model.charAt(0).toLowerCase() + model.slice(1)
            Object.defineProperty(this.replServer.context,`$${modelName}`,{
                get:()=>this.prismaClient[model] // 使用原始模型名称访问
            })
        }
    }

    /**
     * 获取配置文件
     */
    private _loadConfig(){
        const configPath = path.join(getPackageRootPath(),this.options.prismaPath,"shell.json")
        if(fs.existsSync(configPath)){
            const config = require(configPath)
            Object.assign(this.options,config)
        }
    }

    private _createPrismaClient(){        
        const { PrismaClient } = require("@prisma/client")
        return new PrismaClient()        
    }
    get options(){ return this._options! }
    start(){
        this._showLogo()
        this.replServer = repl.start({
            prompt   : this._options.prompt,
            useGlobal: true
        })   
        Object.assign(this.replServer.context, this._buildContext()) 
        this._loadHistory()
        this._createModelShortcuts()
        this._registerCommands()        
    } 

    private _buildContext(){        
        return Object.assign({
            prisma: this._prismaClient,
            db    : this._prismaClient,
            show  : registerShowObject(this),
        },this.options.context)


    }
    /**
     * 显示promise的返回结果
     * 
     * - 如果返回的是一个array，则使用console.table进行输出
     * 
     * 输出表格时，支持两个参数
     *  show($user.findMany(),1)    只显示第1页，每页10行
     *  show($user.findMany(),5)   只显示第5页，每页10行
     *  show($user.findMany(),5,"fieldName,fieldName2,...")   只显示第5页,并且只显示字段
     *  show($user.findMany(),"fieldName,fieldName2,...") 
     * 
     * - 如果返回的是一个标量，则使用console.log输出    
     * 
     * @param promise Promise对象或其他值
     * @param args 分页参数或字段列表
     */
    private _loadHistory(){
        const historyFile = path.join(this.prismaPath,".history")
        this.replServer.setupHistory(historyFile,(err)=>{
            if(err) console.error("无法加载历史记录:",err)
        })
    }
    private _registerCommands(){        
        registerModelsCommand(this)
        registerListModelCommand(this)
    } 

}