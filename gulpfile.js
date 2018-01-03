const Config = 		require('./config.js')
,	gulp = 					require('gulp')
,	$ = 						require('gulp-load-plugins')()
,	del = 					require('del')
,	FolderJS = 		Config.FolderDist + '/js/*.js'
,	FolderCSS = 	Config.FolderDist + '/css/*.css'
,	FolderIMG = 	Config.FolderDist + '/img/**/*'
,	SourceFont = Config.FolderPrivate + '/*.ttf'
,	SourceCSS = 	Config.FolderPrivate + '/scss/*.scss'
,	SourceJS = 		Config.FolderPrivate + '/js/*.js'
,	SourceIMG = 	Config.FolderPrivate + '/img/**/*'

// Process Other files to generate distribuable files
gulp.task('font', () => {
	return gulp.src(SourceFont)
		.pipe(gulp.dest( Config.FolderDist ))
})
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
		.pipe(gulp.dest( Config.FolderDist + '/css'))
})
// Process JS files to generate distribuable files
gulp.task('js', () => {
	return gulp.src(SourceJS)
		.pipe($.uglifyes({
			mangle: false,
			ecma: 6
    }))
		.pipe(gulp.dest( Config.FolderDist + '/js'))
})
// Process IMG files to generate distribuable files
gulp.task('img', () => {
  gulp.src(SourceIMG)
    .pipe($.image())
    .pipe(gulp.dest( Config.FolderDist + '/img'))
})
// Destroy DIST folder to be rightly rebuilt
gulp.task('clean', () => {
	del( Config.FolderDist )
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
gulp.task('default', ['font', 'sass', 'js', 'img'], () => {
})
