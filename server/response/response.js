// const JSON = require('JSON')
CODE_ERROR = 400
CODE_SUCCESS = 200


class Result {
  constructor(data, msg = 'success') {
    if (data) {
      this.data = data
    }
    this.msg = msg
  }

  createResult() {
    let base = {
      code: this.code,
      msg: this.msg,
    }
    if (this.data) {
      base.data = this.data
    }

    return base
  }



  success(res, code = CODE_SUCCESS, resCode = 200) {
    if (!res) {
      throw 'Response is invalid.'
    }
    res.status(resCode)
    this.code = code
    return this.createResult()
  }

  fail(res, code = CODE_ERROR, resCode = 400) {
    if (!res) {
      throw 'Response is invalid.'
    }
    res.status(resCode)
    this.code = code
    return this.createResult()
  }
}

module.exports = Result;
