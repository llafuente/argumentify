# Argumentify [![Build Status](https://secure.travis-ci.org/llafuente/argumentify.png?branch=master)](http://travis-ci.org/llafuente/argumentify)

From JSDoc info make sure that your arguments are valid appending validation code at the beginning of your functions using falafel.

## What does this means ?

```js
/**
 * @param {Number} x
 */
function test(x) {

    // your code wont be modified!
}
```

Will be rewrited to:

```js
/**
 * @param {Number} x
 */
function __number(x) {
if (x == undefined || Number.isNaN(x) || 'number' !== typeof x) {
    throw new Error("x is undefined or null")
}
    // your code wont be modified!
}
```

So your comments generate code... at last!


## Gotchas

Today, it only works with functions at the first level.

I will dig a bit in the next weeks to support functions inside IFFE/SIF and prototypes.

A PR is welcome for sure :)

## Usage

**Browserify transform**

```js
output_stream = fs.createWriteStream('debug/js-2dmath-browser-debug.js');

require('browserify')('./index.js')
    .transform('argumentify')
    .bundle()
    .pipe(output_stream);
```

**Falafel**

```js
var output = require("falafel")(src, {
    comment: true,
    loc: true
}, require("argumentify").falafel);
```

## API


```js
// argumentify itself is a function for browserify compatibility
var argumentify = require("argumentify");

//enable/disable verbose, usefull to fully cover your code
argumentify.verbose({Boolean})

// add new validator or overwrite default ones
argumentify.customValidators({
    Name: {
        // %var-name% is a token for check and message that is obviously... the name of the argument!
        check: ["javascript code inside the if", "another check"] //will be joined with OR!
        message: '%var-name% is undefined or null'
    }
});

// This is the falafel callaback that transform your code
argumentify.falafel;

// return the array with default Number check
argumentify.check.Number();

// return the array with default Boolean check
argumentify.check.Boolean();

// return the array with default Array check
argumentify.check.Array();

// return the array with default Object check
argumentify.check.Object();

// return the array with default Function check
argumentify.check.Function();

// return the array with default fixed size array of numbers check
ArrayOfNumbers(n);

// return the array with default fixed size 2 levels array of numbers check
MultiArrayOfNumbers(n, m)

```

## License

MIT