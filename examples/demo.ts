import { AutoRepl } from './../src';



const context = {
    user: {
        name: "zhangsan",
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
    }
    
}


const repl = new AutoRepl({
    context
})


repl.start()