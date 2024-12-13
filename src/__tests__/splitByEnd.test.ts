import { describe, it, expect } from 'vitest'
import { splitByEnd } from '../utils/splitByEnd'

describe('splitByEnd', () => {
    it('应该正确匹配字符串结尾', () => {
        expect(splitByEnd('hello.', '.')).toEqual(['hello', '.'])
        expect(splitByEnd('hello', '.')).toEqual(['hello', ''])
        expect(splitByEnd('hello.world', '.')).toEqual(['hello.world', ''])
    })

    it('应该正确匹配正则表达式结尾', () => {
        const regex = /[\(\{\[]\s*["']+/
        expect(splitByEnd('hello("', regex)).toEqual(['hello', '("'])
        expect(splitByEnd('hello{ "', regex)).toEqual(['hello', '{ "'])
        expect(splitByEnd('hello["', regex)).toEqual(['hello', '["'])
        expect(splitByEnd('hello(', regex)).toEqual(['hello(', ''])
    })

    it('当没有匹配时应该返回原字符串和空字符串', () => {
        expect(splitByEnd('hello', 'world')).toEqual(['hello', ''])
        expect(splitByEnd('hello', /world/)).toEqual(['hello', ''])
    })

    it('应该处理空字符串输入', () => {
        expect(splitByEnd('', '.')).toEqual(['', ''])
        expect(splitByEnd('', /\./)).toEqual(['', ''])
    })
})

 