const { src, dest, series, watch } = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    svgSprite = require('gulp-svg-sprite'),
    del = require('del'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    webp = require('gulp-webp'),
    gulpAvif = require('gulp-avif'),
    typograf = require('gulp-typograf'),
    zip = require('gulp-zip');

function browsersync() {
    browserSync.init({
        server: { baseDir: 'dist/' },
        // tunnel: true

    });
}
function clean() {
    return del(['dist/*']);
}

function fonts() {
    return src('app/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts/'));
}


function svgSprites() {
    return src('app/img/svg/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('dist/img'));
}



function scripts() {
    src([
        'app/js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(fileinclude())
        // .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
    return src([
        'app/js/libs.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(fileinclude())
        // .pipe(concat('libs.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function styles() {
    src('app/scss/libs.scss')
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(cleancss(({ level: { 1: { specialComments: 0 } }, format: 'expanded' })))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css/'))
        .pipe(browserSync.stream());
    return src('app/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 version'],
            grid: true
        }))
        .pipe(cleancss(({ level: { 1: { specialComments: 0 } }, format: 'expanded' })))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css/'))
        .pipe(browserSync.stream());
}

function htmlInclude() {
    return src(['app/**.html', '!app/_*.html'])
        .pipe(fileinclude())
        .pipe(typograf({ locale: ['ru', 'en-US'] }))
        .pipe(dest('dist'));

}

function images() {
    return src('app/img/**/*')
        .pipe(newer('dist/img/'))
        .pipe(imagemin())
        .pipe(dest('dist/img/'));
}

const webpImages = () => {
    return src('app/img/**/*.{jpg,jpeg,png}')
        .pipe(webp())
        .pipe(dest('dist/img/'));
};
const avifImages = () => {
    return src('app/img/**/*.{jpg,jpeg,png}')
        .pipe(gulpAvif())
        .pipe(dest('dist/img/'));
};

// const resources = ()=> {
//     return src('app/resources/**/*')
//         .pipe(dest('dist/resources'))
//         .pipe(browserSync.stream());
// }

// const php = ()=> {
//     return src('app/mail.php')
//         .pipe(dest('dist'))
//         .pipe(browserSync.stream());
// }
const zipFiles = () => {
    // del(`dist/*.zip`)
    del.sync(['dist/*.zip']);

    // setTimeout(function () {
    return src('dist/*')
        .pipe(zip('archive.zip'))
        .pipe(dest('dist'));
    // }, 200);

}


watch('app/**/*.scss', styles); //.on('change', browserSync.reload)
watch('app/js/**/*.js', scripts);//.on('change', browserSync.reload);//, '!app/**/*.min.js'
watch('app/**/*.html', htmlInclude).on('change', browserSync.reload);
watch('app/img/**/*', images);
watch('app/img/**/*.{jpg,jpeg,png}', webpImages);
watch('app/img/**/*.{jpg,jpeg,png}', avifImages);
watch('app/img/svg/**.svg', svgSprites);

// exports.browsersync = browsersync;
// exports.scripts = scripts;
// exports.styles = styles;
// exports.Include = htmlInclude;
// exports.images = images;
// exports.fonts = fonts;
// exports.clean = clean;

// дефолтный таск




//build

function scriptsBuild() {
    src('app/js/libs.js')
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(dest('dist/js'));
    return src('app/js/main.js')
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(dest('dist/js'));
}

function stylesBuild() {
    src('app/scss/libs.scss')
        .pipe(scss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(cleancss(({ level: { 1: { specialComments: 0 } }, format: 'expanded' })))
        .pipe(dest('dist/css/'));
    return src('app/scss/style.scss')
        .pipe(scss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(cleancss(({ level: { 1: { specialComments: 0 } }, format: 'beautify' })))
        .pipe(dest('dist/css/'));
}

exports.default = series(clean, htmlInclude, scripts, fonts, styles, images, webpImages, avifImages, svgSprites, browsersync);
exports.build = series(clean, htmlInclude, scriptsBuild, fonts, images, webpImages, avifImages, svgSprites, stylesBuild);
exports.zip = zipFiles;
