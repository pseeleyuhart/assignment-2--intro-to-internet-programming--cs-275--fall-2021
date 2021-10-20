const {src, dest, series, watch } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);
const cssLinter = require(`gulp-stylelint`);
const del = require(`del`);
const cssCompressor = require(`gulp-uglifycss`);
const babel = require(`gulp-babel`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;
let browserChoice = `default`;



let validateHTML = () => {
    return src([
        `html/*.html`,
        `html/**/*.html`])
        .pipe(htmlValidator());
};



async function safari () {
    browserChoice = `safari`;
}

async function firefox () {
    browserChoice = `firefox`;
}

async function chrome () {
    browserChoice = `google chrome`;
}

async function opera () {
    browserChoice = `opera`;
}

async function edge () {
    browserChoice = `microsoft-edge`;
}

async function allBrowsers () {
    browserChoice = [
        `safari`,
        `firefox`,
        `google chrome`,
        `opera`,
        `microsoft-edge`
    ];
}



let compressHTML = () => {
    return src([`html/*.html`,`
    html/**/*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};
let compressCSS = () => {
    return src([`css/*.css`,])
        .pipe(cssCompressor())
        .pipe(dest(`prod`));
};

let lintCSS = () => {
    return src(`css/*.css`)
        .pipe(cssLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};






let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod`));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter({
            parserOptions: {
                ecmaVersion: 2017,
                sourceType: `module`
            },
            rules: {
                indent: [2, 4, {SwitchCase: 1}],
                quotes: [2, `backtick`],
                semi: [2, `always`],
                'linebreak-style': [2, `unix`],
                'max-len': [1, 85, 4]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: `eslint:recommended`
        }))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));
};


let serve = () => {
    browserSync({
            notify: true,
            port: 9000,
            reloadDelay: 50,
            browser: browserChoice,
            server: {
                baseDir: [
                    `temp`,
                    `js`,
                    `html`,
                    `css`
                ]
            }
        }


    );

    watch(`js/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`css/*.css`,
        series(lintCSS)
    ).on(`change`, reload);

    watch(`dev/html/**/*.html`,
        series(validateHTML)
    ).on(`change`, reload);

    watch(`dev/img/**/*`).on(`change`, reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`./temp`, `prod`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n${stdout}`);
    });
}
exports.validateHTML = validateHTML;
exports.compressCSS = compressCSS;
exports.compressHTML = compressHTML;
exports.HTMLProcessing = series(validateHTML, compressHTML);


exports.safari = series(safari, serve);
exports.firefox = series(firefox, serve);
exports.chrome = series(chrome, serve);
exports.opera = series(opera, serve);
exports.edge = series(edge, serve);
exports.safari = series(safari, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.lintCSS = lintCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintJS = lintJS;
exports.build = series(
    compressHTML,
    transpileJSForProd,
    compressCSS
);
exports.serve = series( lintJS, transpileJSForDev,validateHTML, lintCSS, serve);
exports.clean = clean;
exports.default = listTasks;
