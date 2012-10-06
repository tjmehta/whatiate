var helpers = module.exports = {};

helpers.isEmpty = function(thing){
  var returnVal;
  if (!thing) {
    returnVal = true;
  }
  else {
    if (typeof thing == 'object') {
      if (Array.isArray(thing)) {
        // array
        returnVal = (thing.length === 0);
      }
      else {
        // object
        returnVal = true;
        for (var key in thing) {
          returnVal = false;
          break;
        }
      }
    }
    else if (typeof thing == 'string') {
      // string
      returnVal = (thing.length === 0);
    }
    else {
      // other
      returnVal = !thing;
    }
  }

  return returnVal;
};

helpers.flattenObj = function(o, startPath){
  var flat = {}, flatten;
  if (!flatten) {
    flatten = function flatten(obj, path){
      if (Object.prototype.toString.call(obj)==='[object Object]') {
        path = path===undefined ? '' : path+'.';
        for(var key in obj)
          flatten( obj[key], path+key);
      }
      else if (Array.isArray(obj)) {
        path = path===undefined ? '' : path+'.';
        var i = 0;
        while (i < obj.length) {
          flatten( obj[i], path+i, flatten);
          i++;
        }
      }
      else {
        flat[path] = obj;
      }
      return flat;
    };
  }
  return flatten(o, startPath);
};

//this function can be improved...! -- edge cases?
helpers.copyValuesToFrom = function(toObj, fromObj){
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      if (typeof fromObj[key] == 'object' && !Array.isArray(fromObj[key])){
        toObj[key] = toObj[key] || {};
        helpers.copyValuesToFrom(toObj[key], fromObj[key]);
      }
      else {
        toObj[key] = fromObj[key];
      }
    }
  }
};

helpers.copyFields = function(obj, fields) {
  var field, fieldArr, i, j, key, keys, newkey, newobj, o, r, ret, val, _i, _len;
  if(!obj) return null;
  if (obj._doc != null) {
    this.obj = obj.toJSON();
  } else {
    this.obj = obj;
  }
  if (fields instanceof Object) {
    fieldArr = [];
    for (field in fields) {
      val = fields[field];
      if (val === 1 || val === true) {
        fieldArr.push(field);
      }
    }
    fields = fieldArr;
  }
  ret = {};
  for (_i = 0, _len = fields.length; _i < _len; _i++) {
    field = fields[_i];
    keys = field.split(".");
    o = this.obj;
    r = ret;
    i = 0;
    newobj = null;
    newkey = null;
    while (i < keys.length) {
      key = keys[i];
      if (!(o[key] != null)) {
        j = 0;
        r = ret;
        if ((newobj != null) && (newkey != null)) {
          delete newobj[newkey];
        }
        break;
      }
      if (i === keys.length - 1) {
        r[key] = o[key];
        break;
      }
      if (!(r[key] != null)) {
        r[key] = {};
        if (!(newobj != null) && !(newkey != null)) {
          newobj = r;
          newkey = key;
        }
      }
      o = o[key];
      r = r[key];
      i++;
    }
  }
  return ret;
};


