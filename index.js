var doctrine = require("doctrine"),
    validators = {},
    verbose = false;

function getNearestFunction(node, max_distance) {
    // search nearest function
    var fn = null,
        min_diff = max_distance || 9999;

    node.parent.body.every(function (subnode) {
        if (subnode.type === "FunctionDeclaration") {
            var diff = subnode.loc.start.line - node.loc.end.line;

            if (diff > 0 && diff < min_diff) {
                min_diff = diff;
                fn = subnode;
            }
        }

        return true;
    });

    return fn;
}

function getArguments(node) {
    var args = [],
        arg,
        i,
        max;

    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
        for (i = 0, max = node.params.length; i < max; ++i) {
            arg = node.params[i].name;

            args.push(arg);
        }
    }

    return args;
}

function getArgumentDoc(arg_name, docs) {
    var i = 0,
        max = docs.tags.length;
    for (i = 0; i < max; ++i) {
        if (docs.tags[i].name === arg_name && docs.tags[i].title === 'param') {
            return docs.tags[i].type;
        }
    }

    return null;
}

function build_validator(variable_name, validations, message) {
    var out = "if (" + validations.join(" && ").replace(/\%var-name\%/g, variable_name) + ") {\n" +
    "    throw new Error(\"" + message.replace(/\%var-name\%/g, variable_name) + "\")\n" +
    "}\n";

    return out;
}

function name_expression(expression, arg_name) {
    if (!validators[expression.name]) {
        verbose && console.error("no validator for: ", expression.name);
        return [];
    }

    var validator = [validators[expression.name].check.join(" || ")];
    return build_validator(arg_name, [validator], validators[expression.name].message);
}

function comment_to_validation(arg_doc, arg_name, validations) {
    validations = validations || [];

    switch(arg_doc.type) {
    case "NameExpression":
        validations = validations.concat(name_expression(arg_doc, arg_name));

        break;
    case "OptionalType":
        // { type: 'OptionalType', expression: { type: 'NameExpression', name: 'Vec2' } }
        var tmp = comment_to_validation(arg_doc.expression, arg_name);

        validations.push(
            "if (" + arg_name +" !== undefined) {\n" +
            tmp.join("\n") +
            "\n}"
        );

        break;
    case "UnionType":
        var chk_union = [],
            chk_message = [];

        arg_doc.elements.forEach(function(expression) {
            if (validators[expression.name]) {
                // negate - OR join
                chk_union.push("!(" + validators[expression.name].check.join(" || ") + ")");
                chk_message.push(validators[expression.name].message);
            } else {
                verbose && console.error("no validator for: ", expression.name);
            }
        });

        if (chk_union.length) {
            validations = validations.concat(
                build_validator(arg_name, chk_union, chk_message.join(" OR "))
            );
        }


        break;
    default:
        verbose && console.error("unsupported / bad formatted comment @param", arg_doc);
    }

    return validations;
}



function falafel_callback(node, transformOptions, done) {
    //console.log(node);
    // gather information from comments
    // comment block & ignore header!
    if (node.type === "Block" && node.loc.start.line !== 1) {
        //console.log("comment", node.loc.start);

        var source = node.source(),
            comment = doctrine.parse(source, {
                unwrap: true,
                lineNumbers: true,
                sloppy: true
            }),
            fn = getNearestFunction(node, 10);

        if (fn !== null) {
            //console.log(node.source());
            //console.log(comment);
            //console.log(fn.source());

            var fn_args = getArguments(fn),
                fn_txt = fn.body.source().trim().substring(1),
                validations = [],
                i,
                arg_doc;

            if (!fn_args.length) {
                done();
                return;
            }


            for (i in fn_args) {
                arg_doc = getArgumentDoc(fn_args[i], comment);

                if (!arg_doc) {
                    verbose && console.error("missing type for: " + fn_args[i] + "\n" + fn.source());
                } else {
                    validations = validations.concat(comment_to_validation(arg_doc, fn_args[i]));
                }
            }

            if (validations.length) {
                fn.body.update("{\n" + validations.join("\n") + fn_txt);
            }

            //console.log(fn.source());
        } else if (source.indexOf("/**") === 0) {
            // only display this message for jsdoc comments
            verbose && console.error("cant find function for: " + source);
        }

        //console.log();
        //console.log(require("util").inspect(), {depth: null, colors: true}));
        //process.exit();
    }

    // apply that information to functions
    done();
}

module.exports = require("browserify-transform-tools").makeFalafelTransform(
    "argumentify",
    {falafelOptions: {comment: true, loc: true}}, falafel_callback);


module.exports.falafel = falafel_callback;

module.exports.check = {};
module.exports.check.Object = function () {
    return [
        "'object' !== typeof %var-name%",
        "Array.isArray(%var-name%)",
        "%var-name% === null"
    ];
};
module.exports.check.Array = function () {
    return [
        "!Array.isArray(%var-name%)"
    ];
};

module.exports.check.Function = function () {
    return [
        "'function' !== typeof %var-name%"
    ];
};

module.exports.check.Boolean = function () {
    return [
        "'boolean' !== typeof %var-name%"
    ];
};

module.exports.check.Number = function (sufix) {
    sufix = sufix || "";

    return [
        "%var-name%" + sufix + " == undefined",
        "Number.isNaN(%var-name%" + sufix + ")",
        "'number' !== typeof %var-name%" + sufix
    ];
};

module.exports.check.ArrayOfNumbers = function (n) {
    var checks = [
        "!Array.isArray(%var-name%)"
        ],
        i;

    for (i = 0; i < n; ++i) {
        checks = checks.concat(module.exports.check.Number("[" + i +"]"));
    }

    return checks;
};

module.exports.check.MultiArrayOfNumbers = function (n, m) {
    var checks = [
        "!Array.isArray(%var-name%)"
        ],
        i,
        j;

    for (i = 0; i < n; ++i) {
        for (j = 0; j < m; ++j) {
            checks = checks.concat(module.exports.check.Number("[" + i +"][" + j + "]"));
        }
    }

    return checks;
};

module.exports.verbose = function(val) {
    if (val === undefined) {
        verbose = !verbose;
    } else {
        verbose = val;
    }

    return this;
};

module.exports.customValidators = function(vals) {
    var i;

    for (i in vals) {
        validators[i] = vals[i];
    }

    return this;
};


module.exports.customValidators({
    Number: {
        check: module.exports.check.Number(),
        message: '%var-name% is undefined or null'
    },
    Boolean: {
        check: module.exports.check.Boolean(),
        message: '%var-name% is not a boolean'
    },
    Array: {
        check: module.exports.check.Array(),
        message: '%var-name% is not a array'
    },
    Object: {
        check: module.exports.check.Object(),
        message: '%var-name% is not a object'
    },
    Function: {
        check: module.exports.check.Function(),
        message: '%var-name% is not a function'
    }
});