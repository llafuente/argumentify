/**
 * File copyright
 */

/**
 * Prototype test2
 * @param {String} abc
 */
function A(abc) {
if ('string' !== typeof abc) {
    throw new Error("abc is undefined or null")
}

}

/**
 * Prototype test2
 * @param {Number} a
 * @param {Number} b
 */
A.prototype.sum = function suma(a, b) {
if (a == undefined || Number.isNaN(a) || 'number' !== typeof a) {
    throw new Error("a is undefined or null")
}

if (b == undefined || Number.isNaN(b) || 'number' !== typeof b) {
    throw new Error("b is undefined or null")
}

}

module.exports = {
    A: A
};


//closure
(function() {

    /**
     * Prototype test2
     * @param {String} abc
     */
    function B(abc) {
if ('string' !== typeof abc) {
    throw new Error("abc is undefined or null")
}

    }

    /**
     * Prototype test2
     * @param {Number} a
     * @param {Number} b
     */
    B.prototype.sum2 = function suma2(a, b) {
if (a == undefined || Number.isNaN(a) || 'number' !== typeof a) {
    throw new Error("a is undefined or null")
}

if (b == undefined || Number.isNaN(b) || 'number' !== typeof b) {
    throw new Error("b is undefined or null")
}

    }

    module.exports.B = B;

}());