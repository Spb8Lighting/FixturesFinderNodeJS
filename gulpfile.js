let gulp = require('gulp')
,	$ = require('gulp-load-plugins')()
,	del = require('del')
,	FolderJS = 	'dist/js/*.js'
,	FolderCSS = 'dist/css/*.css'
,	FolderIMG = 'dist/img/*'
,	SourceCSS = 'private/scss/*.scss'
,	SourceJS = 'private/js/*.js'
,	SourceIMG = 'private/img/*'

// Process SCSS files to generate distribuable files
gulp.task('sass', () => {
	return gulp.src(SourceCSS)
		.pipe($.sass({
			onError: console.error.bind(console, 'SASS Error')
		}))
		.pipe($.autoprefixer({
			browsers: ['last 5 versions']
		}))
		.pipe($.cleanCss())
		.pipe($.rename('min.css'))
		.pipe(gulp.dest('dist/css'))
})
// Process JS files to generate distribuable files
gulp.task('js', () => {
	return gulp.src(SourceJS)
		.pipe($.uglifyes({
			mangle: false,
			ecma: 6
    }))
		.pipe(gulp.dest('dist/js'))
})
// Process IMG files to generate distribuable files
gulp.task('img', () => {
  gulp.src(SourceIMG)
    .pipe($.image())
    .pipe(gulp.dest('dist/img'))
})
// Destroy DIST folder to be rightly rebuilt
gulp.task('clean', () => {
	del('dist')
})
// On any modification of dist file, sent to update on browser
gulp.task('watch', () => {
	let server = $.livereload()
	gulp.watch(SourceCSS, ['sass'])
	gulp.watch(SourceJS, ['js'])
	gulp.watch(SourceIMG, ['img'])
	gulp.watch([FolderIMG, FolderJS, FolderCSS]).on('change', event => {
		server.changed(event.path)
	})
})
// Default task when gulp command launched
gulp.task('default', ['sass', 'js', 'img', 'clean'], () => {
})
