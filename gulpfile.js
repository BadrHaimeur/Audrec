var gulp = require('gulp'),
    uglify_js = require('gulp-uglify'),
    include = require('gulp-file-include'),
    extension = require('gulp-ext'),
    jsdoc = require('gulp-jsdoc3'),
    fs = require('fs'),
    join = require('path').join;


gulp.task('build', [
    'compile',
    'minify',
    'document'
]);

gulp.task('watch', function() {
    gulp.watch([
        '_src/**/*.js'
    ], ['compile'])
});

gulp.task('compile', function() {
    return gulp.src('_src/audrec.inc.js')
        .pipe(include()).on('error', function(error) {
            logError(error);
        })
        .pipe(extension.crop('inc.js'))
        .pipe(extension.append('js'))
        .pipe(gulp.dest('_dist'));
});

gulp.task('minify', function() {
    return gulp.src('_dist/audrec.js')
    .pipe(uglify_js())
    .pipe(extension.crop('js'))
    .pipe(extension.append('min.js'))
    .pipe(gulp.dest('_dist'));
});

gulp.task('document', function (cb) {
    clearDir( '_doc' );
    var config = require('./jsdoc.json');
    gulp.src(['./_dist/audrec.js'], {read: false})
        .pipe(jsdoc(config, cb));
});


/**********************************************
 * Utility functions :
 **********************************************/
/**
 * Deletes all files in a directory including its
 * subdirectories.
 * @param {string} dirname A directory name.
 */
function clearDir( dirname ) {
    fs.readdir(
        dirname,
        (error, files) => {
            if ( error ) {
                logError( error );
            } else {

                files.forEach( function( file ) {
                    if ( !file.includes('.') ) {
                        clearDir( join(dirname, file) );
                    } else {
                        fs.unlink(
                            join(dirname, file),
                            error => {
                                if (error) {
                                    logError( error );
                                }
                            }
                        );
                    }
                } );

            }
        }
    );
}

/**
 * Logs errors in the console .
 * @param  {object} error A simple object with the following properties :
 * filename: [String] The pathname of the file that causesd the error.
 * lineNumber: [Integer] The line number of the code that chaused the error.
 * message: [String] The description of the error.
 */
function logError(error) {
    var line = new Array(80).join('X'),
        red_background = "\x1b[41m",
        normal_background = "\x1b[0m";

    console.error(red_background);
    console.error(line);
    if (error.filename) {
        console.error('Error in: [ ' + error.filename + ' ]');
    } else {
        console.error('Error');
    }

    console.error(line + '\n');
    if (error.lineNumber) {
        console.error('Line: ' + error.lineNumber);
    }

    if (error.message) {
        console.error('Message:\n[ ' + error.message + ' ]\n');
    } else {
        console.error('No information provided .');
    }

    console.error(line);
    console.error(normal_background);
}
