/**
 * File copyright
 */

/**
 * Prototype test2
 * @param {String} abc
 */
function A(abc) {
}

/**
 * Prototype test2
 * @param {Number} a
 * @param {Number} b
 */
A.prototype.sum = function suma(a, b) {
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
    }

    /**
     * Prototype test2
     * @param {Number} a
     * @param {Number} b
     */
    B.prototype.sum2 = function suma2(a, b) {
    }

    module.exports.B = B;

}());