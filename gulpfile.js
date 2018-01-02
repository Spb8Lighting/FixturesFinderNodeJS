let gulp = require('gulp')
,		$ = require('gulp-load-plugins')()
,		EJSViews = ['views/*.ejs', 'views/pages/*.ejs', 'views/partials/*.ejs', 'views/pages/subpages/*.ejs']
,		FolderJS = 	'dist/js/*.js'
,		FolderCSS = 'dist/css/*.css'
,		FolderSCSS = 'private/scss/*.scss'

gulp.task('sass', () => {
	return gulp.src(FolderSCSS)
		.pipe($.sass({
			onError: console.error.bind(console, 'SASS Error')
		}))
		.pipe($.autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
})

gulp.task('watch', () => {
	let server = $.livereload()
	gulp.watch(FolderSCSS, ['sass'])
	gulp.watch([FolderJS, FolderCSS]).on('change', event => {
		server.changed(event.path)
	})
})

gulp.task('clean', () => {
	return gulp.src('dist', {read : false}).pipe($.clean())
})

gulp.task('default', ['sass', 'clean'], () => {
})
