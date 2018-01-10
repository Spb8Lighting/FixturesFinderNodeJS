const Config = 		require('./config.js')
,	gulp = 					require('gulp')
,	$ = 						require('gulp-load-plugins')()
,	del = 					require('del')
,	FolderJS = 		Config.FolderDist + '/js/*.js'
,	FolderCSS = 	Config.FolderDist + '/css/*.css'
,	FolderIMG = 	Config.FolderDist + '/img/**/*'
,	SourceFont = 	Config.FolderPrivate + '/*.ttf'
,	SourceCSS = 	Config.FolderPrivate + '/scss/css.scss'
,	ClientJS = 		['bower_components/jquery/dist/jquery.min.js', 'bower_components/fancybox/dist/jquery.fancybox.min.js', 'bower_components/select2/dist/js/select2.min.js', Config.FolderPrivate + '/js/script.js']
,	AdminJS = 		[Config.FolderPrivate + '/js/socket.io.js']
,	SourceIMG = 	Config.FolderPrivate + '/img/**/*'

// Process Other files to generate distribuable files
gulp.task('font', () => {
	return gulp.src(SourceFont)
		.pipe(gulp.dest( Config.FolderDist ))
})
// Process SCSS files to generate distribuable files
gulp.task('css', () => {
	return gulp.src(SourceCSS)
		.pipe($.sass({
			onError: console.error.bind(console, 'SASS Error')
		}))
		.pipe($.autoprefixer({
			browsers: ['last 5 versions']
		}))
		.pipe(gulp.dest( Config.FolderDist + '/css'))
		.pipe($.cleanCss())
		.pipe($.rename(path => {
			path.basename += '.min'
		}))
		.pipe(gulp.dest( Config.FolderDist + '/css'))
})
// Process JS files to generate distribuable files
function JSMinify (Files, Name) {
	return gulp.src(Files)
		.pipe($.concatUtil(Name))
		.pipe($.concatUtil(Name, {process: (src, filePath) => {
      return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
    }}))
		.pipe($.concatUtil.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe($.concatUtil.footer('\n})(window, document);\n'))
		.pipe($.rename(path => {
			path.basename += '.min'
		}))
		.pipe($.uglifyes({
			mangle: false,
			ecma: 6
    }))
		.pipe(gulp.dest( Config.FolderDist + '/js'))
		.pipe($.babel({
      presets: ['env']
    }))
		.pipe($.uglify())
		.pipe($.rename(path => {
			path.basename += '.es5'
		}))
		.pipe(gulp.dest( Config.FolderDist + '/js'))
}
gulp.task('js:client', () => {
	return JSMinify(ClientJS, 'app.js')
})
gulp.task('js:admin', () => {
	return JSMinify(AdminJS, 'admin.js')
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
	gulp.watch(Config.FolderPrivate + '/scss/*.scss', ['css'])
	gulp.watch(ClientJS, ['js:client'])
	gulp.watch(AdminJS, ['js:admin'])
	gulp.watch(SourceIMG, ['img'])
})
// Default task when gulp command launched
gulp.task('default', ['watch', 'font', 'css', 'js:client', 'js:admin', 'img'], () => {
})
