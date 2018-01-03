//Loab basic Node Module
const		Config = 		require('./config.js') 																// Config File
, fs = 						require('fs')																							// FileSystem
, express = 			require('express')																				// HTTP Server
, favicon = 			require('express-favicon')																// Favicon
, helmet = 				require('helmet')																					// HTTP Protection
//, session = 			require('express-session')																// HTTP Session
, bodyParser = 		require('body-parser')																		// HTTP Parser
, sleep = 				require('system-sleep')																		// Sleep function
, recursive = 		require('recursive-readdir')															// Recursive File listing
, _ =							require('lodash')																					// Lodash
, app = 					express()																									// Define HTTP Server
, server = 				app.listen( Config.HttpPort )														// Define HTTP Port server
, io = 						require('socket.io').listen(server)												// Socket IO server

app.use(helmet())																																// Set Helmet for HTTP protection
/*
app.use(session({																																// Set session
	secret : 'secretpassphrase',
	resave : false,
	saveUninitialized : true,
	cookie: { secure : false }
}))
app.use(require( Config.FolderMiddlewares() + '/flash.js'))											// Set Flash MiddleWares
*/
app.use('/dist', express.static( __dirname + '/' + Config.FolderDist ))										// Set 	Generic 				Public Folder
app.use('/assets/js/jquery', express.static( __dirname + '/' + Config.FolderJquery.js ))				// Set 	jQuery JS 			Public Folder
app.use('/assets/js/socketIO', express.static( __dirname + '/' + Config.FolderSocketIO.js ))		// Set 	Socket IO 			Public Folder
app.use('/assets/js/select2', express.static( __dirname + '/' + Config.FolderSelect2.js ))			// Set 	Select2 JS			Public Folder
app.use('/assets/css/select2', express.static( __dirname + '/' + Config.FolderSelect2.css ))		// Set 	Select2 CSS			Public Folder
app.use('/assets/js/fancybox', express.static( __dirname + '/' + Config.FolderFancybox.js ))		// Set 	Fancybox JS			Public Folder
app.use('/assets/css/fancybox', express.static( __dirname + '/' + Config.FolderFancybox.css ))	// Set 	Fancybox CSS		Public Folder
app.use(favicon(__dirname + '/dist/favicons/favicon.ico'))																// Set the favicon

app.set('view engine', 'ejs')																										// Set Render engine
app.set('views', __dirname + '/' + Config.FolderViews )																					// Set View root folder

// create application/json parser
let jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

function Percentage(done, total) {
	return Math.round((done * 100 / total) * 100) / 100
}
//Socket routing
io.on('connection', socket => {
	io.sockets.emit('user connected')
	socket.on('action', data => {
		//Reparse the input datas
			data = JSON.parse(data)

		// Set the severals variables used later
		let		Database = {}
			,		FoldersToScan = {}

		// If not specified to scan all folder, reduce the Folders to be scan to the newest one
			if(data[Config.AdminForm.IngestAllLibraries]) {
				FoldersToScan = Config.FixtureLibraryReleases
			} else {
				let maxDate = _.max(Object.keys(Config.FixtureLibraryReleases, o => { Config.FixtureLibraryReleases[o] }))
				FoldersToScan[maxDate] = Config.FixtureLibraryReleases[maxDate]
			}

		let NumberOfFolderToScan = Object.keys(FoldersToScan).length
		,		NumberOfFolderScanned = 0

		for(let key in FoldersToScan) {
			NumberOfFolderScanned++
			io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Init', percentage : 0, description : key })
			recursive(FoldersToScan[key], ['*.+(png|PNG|bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|xslt|XSLT)'])
				.then(files => {

					let XMLWheels = []
					,		XMLFixtures = []
					,		len = files.length

					for (let i = 0; i < len; i++) {
						if(i%10 == 0) {
							io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'FileSystem', percentage : Percentage((i + 1), len), description : (i + 1) + '/' + len + ' files ingested...' } )
						}
						let PathPart = files[i].split('\\')
						,		NbOfLvl = PathPart.length
						if(NbOfLvl == 4) {					// Only AccessoriesIndex.xml file (Wheel)
							if(typeof Database[PathPart[2]] !== 'object') {
								Database[PathPart[2]] = {}
							}
							Database[PathPart[2]]['HasAccessories'] = true
							XMLWheels.push(files[i])
							if(i%10 == 0) {
								io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Accessories', percentage : 0, description : XMLWheels.length + ' accessories' } )
							}
						} else if (NbOfLvl == 5) {	// Only Fixture XML file & Xslt
							if(typeof Database[PathPart[2]] !== 'object') {
								Database[PathPart[2]] = {}
							}
							if(typeof Database[PathPart[2]][PathPart[3]] !== 'object') {
								Database[PathPart[2]][PathPart[3]] = {}
							}
							if(PathPart[4] != PathPart[3] + '.xml') {
								Database[PathPart[2]][PathPart[3]]['xml_status'] = Config.ErrorMessage.XMLFileNotLikeFixture
							}
							if(PathPart[4].toLowerCase() != 'personalities.xml') {
								Database[PathPart[2]][PathPart[3]]['xml'] = PathPart[4]
								XMLFixtures.push(files[i])
								if(i%10 == 0) {
									io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Charts', percentage : 0, description : XMLFixtures.length + ' Charts' } )
								}
							} else if (PathPart[4] == 'personalities.xml') {
								Database[PathPart[2]][PathPart[3]]['HasPersonalities'] = true
							}
						}
					}
					let feedback = XMLWheels.length + ' wheels detected | ' + XMLFixtures.length + ' Fixtures detected'
					io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'FileSystem', percentage : 100, description : len + ' files' } )
					//console.log(Database)
				})
				.catch(error => console.error('Something went wrong', error))
		}
	})
  socket.on('disconnect', () => {
		socket.emit('user disconnected')
  })
})

// Route Home
app.get('/', (req, res) => {
	// Page Settings
		res.locals.Page = 'home'
		res.locals.SiteName = Config.SiteName
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
app.get('/admin', (req, res) => {
	// Page Settings
		res.locals.Page = 'admin'
		res.locals.SiteName = Config.SiteName
		res.locals.PageTitle = 'Administration - Fixture Finder @nline'
		res.locals.FormID = Config.AdminForm
	// Rendering Page
		res.render('index', (err, html) => {
			if(err) {
		  	res.status(500).send(err).end()
			} else {
				res.status(200).send(html).end()
			}
		})
})

// Route all other
app.get('*', (req, res) => {
	// Page Settings
		res.locals.Page = '404'
		res.locals.SiteName = Config.SiteName
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
