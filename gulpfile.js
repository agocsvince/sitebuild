const gulp = require('gulp'),
    sass = require('gulp-sass')(require('node-sass')),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    cachebust = require('gulp-cache-bust');

var realFavicon = require('gulp-real-favicon');
var fs = require('fs');
var FAVICON_DATA_FILE = 'faviconData.json'; // File where the favicon markups are stored

sass.compiler = require('node-sass');

gulp.task('styles', function() {
    var processors = [
        autoprefixer(),
        cssnano({ zindex: false })
    ];
    return gulp.src('src/assets/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(postcss(processors))
        .pipe(cachebust({ type: 'timestamp' }))
        .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('imagemin', async function() {
    gulp.src('./src/assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/assets/img'))
});

gulp.task('fonts', function() {
    return gulp.src('src/assets/scss/fonts/*')
        .pipe(gulp.dest('dist/assets/css/fonts/'));
});

gulp.task('favicon', function() {
    return gulp.src('src/assets/icon/*')
        .pipe(gulp.dest('dist/assets/icon/'));
});

gulp.task('scripts', function() {
    return gulp.src('src/assets/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('copyCSS', function() {
    return gulp.src('src/assets/css/*.css')
        .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('copyHTML', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyPHP', function() {
    return gulp.src('src/**/*.php')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyWPimage', function() {
    return gulp.src('src/*.png')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyWPstyle', function() {
    return gulp.src('src/style.css')
        .pipe(gulp.dest('dist/'));
});

gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('dist/assets/webfonts/'));
});

gulp.task('watch', function() {
    gulp.watch('./src/assets/scss/**/*.scss', gulp.series('styles'));
    console.log('gulp is watching for SCSS changes 👀');
    gulp.watch('./src/**/*.html', gulp.series('copyHTML'));
    console.log('gulp is watching for changes in HTML files ⌨️');
    gulp.watch('./src/assets/js/**/*.js', gulp.series('scripts'));
    console.log('gulp is watching for changes in Javascript files ⌨️');
    return
});
gulp.task('watchWP', function() {
    gulp.watch('./src/assets/scss/**/*.scss', gulp.series('styles'));
    console.log('gulp is watching for SCSS changes 👀');
    gulp.watch('./src/**/*.php', gulp.series('copyPHP'));
    console.log('gulp is watching for changes in PHP files ⌨️');
    gulp.watch('./src/assets/js/**/*.js', gulp.series('scripts'));
    console.log('gulp is watching for changes in Javascript files ⌨️');
    return
});

gulp.task('wordpress', gulp.series('copyWPimage', 'copyWPstyle', 'copyPHP', 'watchWP'));
gulp.task('default', gulp.series('imagemin', 'icons', 'fonts', 'copyHTML', 'copyPHP', 'copyCSS', 'scripts', 'styles', 'watch'));

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: './src/assets/icon/favicon.png',
        dest: './src/assets/icon/',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: true,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {
                design: 'raw'
            },
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#ffffff',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'shadow',
                themeColor: '#ffffff',
                manifest: {
                    name: 'Igazinő',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#f2f2f2'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: true,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
    return gulp.src(['./src/index_html.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('./dist/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});