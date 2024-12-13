




export function splitByEnd(str: string, end: string | RegExp):[string,string] | undefined {    
    if (typeof end === 'string') {
        if (str.endsWith(end)) {
            const pos = str.length - end.length
            return [str.slice(0, pos), str.slice(pos)]
        }
    } else {
        const match = str.match(end)
        if (match && match.index !== undefined && match.index + match[0].length === str.length) {
            const pos = match.index
            return [str.slice(0, pos), str.slice(pos)]
        }
    }
    return 
}