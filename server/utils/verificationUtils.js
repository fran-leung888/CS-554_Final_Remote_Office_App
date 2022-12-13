const { ObjectId } = require("mongodb");

function verifyString(str, description) {
  let result = {
    valid: true,
    description: "",
  };
  if (!str || typeof str != "string") {
    result.valid = false;
    result.description = description + " is invalid.";
    return result;
  }
  str = str.trim();
  if (str.length == 0) {
    result.valid = false;
    result.description = description + " can't be empty.";
    return result;
  }
  return result;
}

function verifyObj(obj, description) {
  let result = {
    valid: true,
    description: "",
  };
  if (!obj || typeof obj != "object") {
    result.valid = false;
    result.description = description + " is invalid.";
    return result;
  }
  return result;
}

function checkId(id) {
  let result = {
    valid: false,
    description: "",
  };
  if (!id) {
    result.description = "id can not be empty.";
    return result;
  }
  if (typeof id !== "string") {
    result.description = "Id must be a string";
    return result;
  }
  id = id.trim();
  if (id.length === 0) {
    result.description = "Id cannot be an empty string or just spaces";
    return result;
  }
  if (!ObjectId.isValid(id)) {
    result.description = "invalid object ID";
    return result;
  }
  result.valid = true
  return result
}

const checkResult = function (result) {
  if (result.valid == false) throw result.description;
  return true;
};

const checkResultQuiet = function (result) {
    return result.valid
  };

const checkRes = function (res) {
  if (res.code != 200) throw res.msg;
};

module.exports = { checkResultQuiet, checkResult, verifyString, verifyObj, checkRes, checkId };
