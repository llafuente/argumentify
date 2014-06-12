// this comment must be


/**
 * @param {Number} x
 */
function __number(x) {
if (x == undefined || Number.isNaN(x) || 'number' !== typeof x) {
    throw new Error("x is undefined or null")
}

}

/**
 * @param {Boolean} b
 */
function __boolean(b) {
if ('boolean' !== typeof b) {
    throw new Error("b is not a boolean")
}

}

/**
 * @param {Array} a
 */
function __array(a) {
if (!Array.isArray(a)) {
    throw new Error("a is not a array")
}

}

/**
 * @param {Object} o
 */
function __object(o) {
if ('object' !== typeof o || Array.isArray(o) || o === null) {
    throw new Error("o is not a object")
}

}

/**
 * @param {Function} fn
 */
function __function(fn) {
if ('function' !== typeof fn) {
    throw new Error("fn is not a function")
}

}

/**
 * Optional test
 * @param {Function=} fn
 */
function __ofunction(fn) {
if (fn !== undefined) {
if ('function' !== typeof fn) {
    throw new Error("fn is not a function")
}

}
}



module.exports = {
    __number: __number,
    __boolean: __boolean,
    __array: __array,
    __object: __object,
    __function: __function,
    __ofunction: __ofunction
};