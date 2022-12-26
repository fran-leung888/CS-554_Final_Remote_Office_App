function verifyString(str, description) {
    let result = {
        valid: true,
        description: ''
    }
    if(!str|| typeof str != "string"){
        result.valid = false
        result.description = description + ' is invalid.'
        return result
    }
    str = str.trim()
    if(str.length == 0){
        result.valid = false
        result.description = description + ' can\'t be empty.'
        return result    
    }
    return result
}

function verifyObj(obj, description) {
    let result = {
        valid: true,
        description: ''
    }
    if(!obj || typeof obj != "object"){
        result.valid = false
        result.description = description + ' is invalid.'
        return result
    }
    return result
}


const checkResult = function(result){
    if(result.valid == false)
        throw result.description
    return true
}

const checkRes = function(res){
    if(res.code != 200)
        throw res.msg
}

export {
    checkResult,
    verifyString,
    verifyObj,
    checkRes
}