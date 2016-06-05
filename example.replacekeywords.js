var replace = require("replace");

replace({
    regex: "@owmkey@",
    replacement: "<<owmkey>>",
    paths: ['./dist'],
    recursive: true,
    silent: true
});
