import { BuildFlag, CONFIG } from './src/Config';
import { buildBooks } from './src/build/books';

//

import { src, dest, series, parallel, watch } from 'gulp';
import { buildAll } from './src/build/build';

//
// Gulp Plugins
//

let del = require('del');
let rename = require('gulp-rename');

let style_sass = require('gulp-sass'); style_sass.compiler = require('dart-sass');
let style_cleanCSS = require('gulp-clean-css');
let style_autoprefixer = require('gulp-autoprefixer');

let script_babel = require('gulp-babel');
let script_uglify = require('gulp-uglify');

//
// Site building
//

function styles()
{
    return src('site/_styles/_global.scss') // Global
        .pipe(rename('global.css'))
        .pipe(src('site/_styles/pages/**/*.scss')) // Separate page styles
        .pipe(style_sass())
        .pipe(style_cleanCSS({ level: 2 }))
        .pipe(style_autoprefixer())
        .pipe(dest('out/site/styles'));
}

function scripts()
{
    return src('site/_scripts/**/*.js')
        .pipe(script_babel(
            {
                presets: ['@babel/env'],
                plugins: ["@babel/plugin-proposal-class-properties"]
            }
        ))
        .pipe(script_uglify())
        .pipe(dest('out/site/scripts'));
}

function files()
{
    return src([
            'site/**/*',
            '!site/**/_*',
            '!site/**/_*/**/*'
        ])
        .pipe(dest('out/site'));
}

//
// Misc
//

function clear(cb: any)
{
    return del('out/**', { force: true });
}

//
// Build
//

function build(cb: any)
{
    buildAll(true);
    cb();
}

function buildOut(cb: any)
{
    buildAll()
    cb();
}


function watchBuild()
{
    watch([
        'site/**/*',
        'data/books/**/*'
    ], exports.build);
}

//
//
//

exports.build = series(clear, parallel(build, styles, scripts, files));
exports.buildOut = series(clear, parallel(buildOut, styles, scripts, files));
exports.watch = watchBuild;