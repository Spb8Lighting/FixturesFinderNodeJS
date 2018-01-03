let gulp = require('gulp')
,		$ = require('gulp-load-plugins')()
,		del = require('del')
,		pump = require('pump')
,		EJSViews = ['views/*.ejs', 'views/pages/*.ejs', 'views/partials/*.ejs', 'views/pages/subpages/*.ejs']
,		FolderJS = 	'dist/js/*.js'
,		FolderCSS = 'dist/css/*.css'
,		SourceCSS = 'private/scss/*.scss'
,		SourceJS = 'private/js/*.js'

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
gulp.task('js', (cb) => {
	return gulp.src(SourceJS)
		.pipe($.uglifyes({
       mangle: false,
       ecma: 6
    }))
		.pipe(gulp.dest('dist/js'))
})

gulp.task('watch', () => {
	let server = $.livereload()
	gulp.watch(SourceCSS, ['sass'])
	gulp.watch(SourceJS, ['js'])
	gulp.watch([FolderJS, FolderCSS]).on('change', event => {
		server.changed(event.path)
	})
})

gulp.task('clean', () => {
	del('dist')
})

gulp.task('default', ['sass', 'js', 'clean'], () => {
})
