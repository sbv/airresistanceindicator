var replace = require("replace");

replace({
    regex: "@owmkey@",
    replacement: "<<owmkey>>",
    paths: ['./dist'],
    recursive: true,
    silent: true
});

replace({
    regex: "@googleanalyticskey@",
    replacement: "<<googleanalyticskey>>",
    paths: ['./dist'],
    recursive: true,
    silent: true
});

