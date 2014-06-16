# Argumentify [![Build Status](https://secure.travis-ci.org/llafuente/argumentify.png?branch=master)](http://travis-ci.org/llafuente/argumentify)

From JSDoc info make sure that your arguments are valid appending validation code at the beginning of your functions using [https://github.com/substack/node-falafel](falafel).

## What does this means?

```js
/**
 * @param {Number} x
 */
function test(x) {

    // your code wont be modified!
}
```

Will be rewritten to:

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


## Usage

**Browserify transform**

```js
output_stream = fs.createWriteStream('debug/js-2dmath-browser-debug.js');

require('browserify')('./index.js')
    .transform('argumentify')
    //or: .transform(require('argumentify').verbose())
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

// return the array with default String check (typeof)
argumentify.check.String();

// return the array with default Number check (typeof, !isNaN)
argumentify.check.Number();

// return the array with default Boolean check (typeof)
argumentify.check.Boolean();

// return the array with default Array check (Array.isArray)
argumentify.check.Array();

// return the array with default Object check (typeof, !Array.isArray)
argumentify.check.Object();

// return the array with default Function check (typeof)
argumentify.check.Function();

// return the array with default fixed size array of numbers check (...)
ArrayOfNumbers(n);

// return the array with default fixed size 2 levels array of numbers check (...)
MultiArrayOfNumbers(n, m)

```

## License

MIT