
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
    const users=[
        {
            name: '张三',
            email: 'zhangsan@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `张三的文章 ${i+1}`,
                content: `这是张三的第${i+1}篇文章内容`
            }))
        },
        {
            name: '李四',
            email: 'lisi@126.com', 
            posts: Array(10).fill(null).map((_,i) => ({
                title: `李四的文章 ${i+1}`,
                content: `这是李四的第${i+1}篇文章内容`
            }))
        },
        {
            name: '王五',
            email: 'wangwu@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `王五的文章 ${i+1}`,
                content: `这是王五的第${i+1}篇文章内容` 
            }))
        },
        {
            name: '赵六',
            email: 'zhaoliu@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `赵六的文章 ${i+1}`,
                content: `这是赵六的第${i+1}篇文章内容`
            }))
        },
        {
            name: '孙七',
            email: 'sunqi@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `孙七的文章 ${i+1}`,
                content: `这是孙七的第${i+1}篇文章内容`
            }))
        },
        {
            name: '周八',
            email: 'zhouba@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `周八的文章 ${i+1}`,
                content: `这是周八的第${i+1}篇文章内容`
            }))
        },
        {
            name: '吴九',
            email: 'wujiu@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `吴九的文章 ${i+1}`,
                content: `这是吴九的第${i+1}篇文章内容`
            }))
        },
        {
            name: '郑十',
            email: 'zhengshi@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `郑十的文章 ${i+1}`,
                content: `这是郑十的第${i+1}篇文章内容`
            }))
        },
        {
            name: '钱十一',
            email: 'qianshiyi@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `钱十一的文章 ${i+1}`,
                content: `这是钱十一的第${i+1}篇文章内容`
            }))
        },
        {
            name: '孔十二',
            email: 'kongshier@126.com',
            posts: Array(10).fill(null).map((_,i) => ({
                title: `孔十二的文章 ${i+1}`,
                content: `这是孔十二的第${i+1}篇文章内容`
            }))
        }
    ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        posts: {
          create: userData.posts
        }
      }
    })
    console.log(`已创建用户: ${user.name}`)
  } 

  console.log('已创建所有用户和文章')

}


main()
.catch(e => {
    throw e
})
.finally(async () => {
    await prisma.$disconnect()
})