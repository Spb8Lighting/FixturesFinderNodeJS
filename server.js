//Loab basic Node Module
let		Config = 				require('./config.js') 																		// Config File
,		 	fs = 						require('fs')																							// FileSystem
,			express = 			require('express')																				// HTTP Server
,			helmet = 				require('helmet')																					// HTTP Protection
,			session = 			require('express-session')																// HTTP Session
,			bodyParser = 		require('body-parser')																		// HTTP Parser
,			sleep = 				require('system-sleep')																		// Sleep function
, 		recursive = 		require("recursive-readdir")															// Recursive File listing
,			app = 					express()																									// Define HTTP Server
,			server = 				app.listen( Config.HttpPort() )														// Define HTTP Port server
,			io = 						require('socket.io').listen(server)												// Socket IO server

app.use(helmet())																																// Set Helmet for HTTP protection
app.use(session({																																// Set session
	secret : 'secretpassphrase',
	resave : false,
	saveUninitialized : true,
	cookie: { secure : false }
}))
app.use(require( Config.FolderMiddlewares() + '/flash.js'))											// Set Flash MiddleWares
app.use('/assets', express.static( Config.FolderPublic() ))											// Set 	Generic 				Public Folder
app.use('/assets/js/jquery', express.static( Config.FolderJquery.js() ))				// Set 	jQuery JS 			Public Folder
app.use('/assets/js/socketIO', express.static( Config.FolderSocketIO.js() ))		// Set 	Socket IO 			Public Folder
app.use('/assets/js/select2', express.static( Config.FolderSelect2.js() ))			// Set 	Select2 JS			Public Folder
app.use('/assets/css/select2', express.static( Config.FolderSelect2.css() ))		// Set 	Select2 CSS			Public Folder
app.use('/assets/js/fancybox', express.static( Config.FolderFancybox.js() ))		// Set 	Fancybox JS			Public Folder
app.use('/assets/css/fancybox', express.static( Config.FolderFancybox.css() ))	// Set 	Fancybox CSS		Public Folder

app.set('view engine', 'ejs')																										// Set Render engine
app.set('views', Config.FolderViews() )																					// Set View root folder

// create application/json parser
let jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//Socket routing
io.on('connection', (socket) => {
	let clientIp = socket.request.connection.remoteAddress;
  io.emit('communication', { status : 'opened' });
	console.log('user connected from ' + clientIp)
  socket.on('disconnect', () => {
    console.log('user disconnected from ' + clientIp)
  })
})

// Route Home
app.get('/', (req, res) => {
	// Page Settings
		res.locals.Page = 'home'
		res.locals.SiteName = Config.SiteName()
		res.locals.PageTitle = 'Fixture Finder @nline'
	// Rendering Page
		res.render('index', (err, html) => {
			if(err) {
		  	res.status(500).send(err).end()
			} else {
				res.status(200).send(html).end()
			}
		})
})
// Route Admin
app.route('/admin')
	.get((req, res) => {
		// Page Settings
			res.locals.Page = 'admin'
			res.locals.SiteName = Config.SiteName()
			res.locals.PageTitle = 'Administration - Fixture Finder @nline'
			res.locals.FormID = Config.AdminForm()
		// Rendering Page
			res.render('index', (err, html) => {
				if(err) {
			  	res.status(500).send(err).end()
				} else {
					res.status(200).send(html).end()
				}
			})
	})
	.post(urlencodedParser, (req, res) => {
		// Check inputs
			let 	Inputs = {}
			,			InputsSize = Object.keys(req.body).length
			if(!req.body || InputsSize == 2) {
				req.flash('error', 'Nothing to do')
			} else {
				if(req.body[Config.AdminForm().IngestFixture]) {
					req.flash('ok', 'Fixture Ingestion launch')
					// ignore files named "foo.cs" or files that end in ".html".
					recursive("some/path", (err, files) => {
					  console.log(files)
					})
				} else {
					req.flash('ok', 'Function not yet implemented')
				}
			}
		// Redirect
			res.redirect('/admin')
	})

// Route all other
app.get('*', (req, res) => {
	// Page Settings
		res.locals.Page = '404'
		res.locals.SiteName = Config.SiteName()
		res.locals.PageTitle = 'Error 404 - Fixture Finder @nline'
	// Rendering Page
		res.render('index', (err, html) => {
			if(err) {
		  	res.status(500).send(err).end()
			} else {
				res.status(404).send(html).end()
			}
		})
})
