var tap = require("tap"),
    test = tap.test,
    mfixture;

//setup

test("Generate file!", function(t) {
        var browserify = require('browserify'),
            fs = require('fs'),
            output_stream = fs.createWriteStream(__dirname +'/generated-fixture.js'),
            by;

        by = browserify(__dirname + '/fixtures.js');
        by
            .on('file', function (file, id, parent) {
                console.log("file read", arguments);
            })
            .on("transform", function() {
                console.log("transformation end", arguments);
            })
            .transform(require("../index.js"))
            .bundle()
            .pipe(output_stream);

        output_stream.on("close", function() {
            console.log("end-of-generation");
            t.end();
        });

});


test("test Generated file!", function(t) {

    // remove browserify code, so we can require it!
    var file = require("fs").readFileSync(__dirname + '/generated-fixture.js', {encoding: "UTF-8"});
    file = file.split("\n");
    file.pop();
    file.shift();

    require("fs").writeFileSync(__dirname + '/generated-fixture.js', file.join("\n"));
    // YEAH!

    mfixture = require("./generated-fixture.js");

    t.end();
});

test("test number!", function(t) {

    var _throw = [function() {}, {}, [], null, undefined, Number.NaN],
        _no_throw =[10, 0, 1e10, 1 / 0];

    _no_throw.forEach(function(val) {
        t.doesNotThrow(function() {
            mfixture.__number(val);
        }, "number: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    _throw.forEach(function(val) {
        t.throws(function() {
            mfixture.__number(val);
        }, "number: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    t.end();
});

test("test boolean!", function(t) {

    var _throw = [function() {}, {}, [], null, undefined, 10, 0],
        _no_throw =[true, false];

    _no_throw.forEach(function(val) {
        t.doesNotThrow(function() {
            mfixture.__boolean(val);
        }, "boolean: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    _throw.forEach(function(val) {
        t.throws(function() {
            mfixture.__boolean(val);
        }, "boolean: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    t.end();
});

test("test array!", function(t) {

    var _throw = [function() {}, {}, null, undefined, 10, 0, true, false, NaN],
        _no_throw =[[], [1, 2, 3]];

    _no_throw.forEach(function(val) {
        t.doesNotThrow(function() {
            mfixture.__array(val);
        }, "array: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    _throw.forEach(function(val) {
        t.throws(function() {
            mfixture.__array(val);
        }, "array: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    t.end();
});


test("test object!", function(t) {

    var _throw = [function() {}, null, undefined, 10, 0, true, false, NaN],
        _no_throw =[{}, {abc: 1000}];

    _no_throw.forEach(function(val) {
        t.doesNotThrow(function() {
            mfixture.__object(val);
        }, "object: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    _throw.forEach(function(val) {
        t.throws(function() {
            mfixture.__object(val);
        }, "object: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    t.end();
});


test("test function!", function(t) {

    var _throw = [{}, {abc: 1000}, null, undefined, 10, 0, true, false, NaN],
        _no_throw =[function() {}];

    _no_throw.forEach(function(val) {
        t.doesNotThrow(function() {
            mfixture.__function(val);
        }, "object: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    _throw.forEach(function(val) {
        t.throws(function() {
            mfixture.__function(val);
        }, "object: " + Object.prototype.toString.call(val) + (val && val.toString ? val.toString() : " ? "));
    });

    t.end();
});