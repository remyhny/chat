var gulp = require("gulp");
var less = require('gulp-less');

gulp.task('styles', function() {
gulp.src(['App/Css/app.less'])
    .pipe(less())
    .pipe(gulp.dest('App/Css'))
})

gulp.task('default', function() {
	gulp.run('styles');
})