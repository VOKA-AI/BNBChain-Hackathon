export function BytesNum2Str(BytesNum: number):string {
    if(BytesNum < 1024) {
        return BytesNum.toFixed(2).toString() + " Bytes"
    }
    if(BytesNum < 1024 * 1024) {
        return (BytesNum/1024).toFixed(2).toString() + " KB"
    }
    if(BytesNum < 1024 * 1024 * 1024) {
        return (BytesNum/(1024 * 1024)).toFixed(2).toString() + " MB"
    }
    if(BytesNum < 1024 * 1024 * 1024 * 1024) {
        return (BytesNum/(1024 * 1024 * 1024)).toFixed(2).toString() + " GB"
    }
    if(BytesNum < 1024 * 1024 * 1024 * 1024 * 1024) {
        return (BytesNum/(1024 * 1024 * 1024 * 1024)).toFixed(2).toString() + " TB"
    }
    return BytesNum.toString();
}

export function stringMaxLenRemainSuffix(str: string, maxLen: number) {
    let len = str.length
    if(len < maxLen) {
        return str
    }
    return str.slice(0,3) + "..." + str.substring(str.indexOf('.') - 2)
}

export function stringMaxLen(str: string, maxLen: number) {
    let len = str.length
    if(len < maxLen) {
        return str
    }
    return str.slice(0,3) + "..." + str.substring(len - 3)
}