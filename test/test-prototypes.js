var tap = require("tap"),
    test = tap.test,
    mfixture;

//setup

test("Generate file!", function(t) {
        var browserify = require('browserify'),
            fs = require('fs'),
            output_stream = fs.createWriteStream(__dirname +'/generated-fixture.js'),
            by;

        by = browserify(__dirname + '/fixtures2.js');
        by
            .on('file', function (file, id, parent) {
                console.log("file read", file);
            })
            .on("transform", function(file) {
                console.log("transformation end", file);
            })
            .transform(require("../index.js").verbose())
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

    console.log(mfixture);

    t.doesNotThrow(function() {
        new mfixture.A("hell");
    }, "create A");
    t.doesNotThrow(function() {
        new mfixture.B("fire");
    }, "create B");

    t.end();
});

