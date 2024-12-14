import { PrismaShell } from '../src';



const context = {
    user: {
        name: "zhangsan",
        name2: "zhangsan2",
        name3: "zhangsan3",
        name4: "zhangsan4",
        name5: "zhangsan5",
        age: 18,
        address: "beijing",
        phone: "123456789",
        tags: ["a", "b", "c"],        
    },
    userGroup: {
        name: "group1",
        users: ["zhangsan", "lisi", "wangwu"],
    },
    userInfo: {
        name: "zhangsan",
        nax2me2:"zhangsan2",
        nay3me3:"zhangsan3",        
        age: 18,
        address: "beijing",
        phone: "123456789",
        tags: ["a", "b", "c"],        
    },
    hello() {
      return "Hello AutoRepl!"  
    },
    async getUser(){
        return ["zhangsan", "lisi", "wangwu"]
    }
    
}


const repl = new PrismaShell({
    context
})


repl.start()