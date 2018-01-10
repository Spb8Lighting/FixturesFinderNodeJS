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
,	sortObj = 			require('sort-object')																		// Sort Object Function
, app = 					express()																									// Define HTTP Server
, server = 				app.listen( Config.HttpPort )															// Define HTTP Port server
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
app.use('/dist', express.static( __dirname + '/' + Config.FolderDist ))					// Set 	Generic Public Folder
app.use(favicon(__dirname + '/dist/favicons/favicon.ico'))											// Set the favicon

app.set('view engine', 'ejs')																										// Set Render engine
app.set('views', __dirname + '/' + Config.FolderViews )													// Set View root folder

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
		let	FoldersToScan = {}
		, MostRecentFolder = _.max(Object.keys(Config.FixtureLibraryReleases, o => { Config.FixtureLibraryReleases[o] }))

		// If not specified to scan all folder, reduce the Folders to be scan to the newest one
			if(data[Config.AdminForm.IngestAllLibraries]) {
				FoldersToScan = Config.FixtureLibraryReleases
			} else {
				FoldersToScan[MostRecentFolder] = Config.FixtureLibraryReleases[MostRecentFolder]
			}

		let NumberOfFolderToScan = Object.keys(FoldersToScan).length
		,		NumberOfFolderScanned = 0

		for(let key in FoldersToScan) {
			NumberOfFolderScanned++
			io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Init', percentage : 0, description : key })
			recursive(FoldersToScan[key], ['*.+(png|PNG|bmp|BMP|jpeg|jpg|gif)'])
				.then(files => {
					return new Promise((resolve, reject) => {

						let Database = {}
						,		XMLWheels = []
						,		XMLFixtures = []
						,		len = files.length

						for (let i = 0; i < len; i++) {
							// Sent socket each %10 to avoid too much communication
							if(i%10 == 0) {
								io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'FileSystem', percentage : Percentage((i + 1), len), description : (i + 1) + '/' + len + ' files ingested...' } )
							}
							let PathPart = files[i].split('\\')
							,		NbOfLvl = PathPart.length
							if(NbOfLvl == 4) {					// Only AccessoriesIndex.xml file (Wheel)
								if(typeof Database[PathPart[2]] !== 'object') {
									Database[PathPart[2]] = {}
								}
								if(PathPart[3].toLowerCase() == 'accessoriesindex.xml') {
									Database[PathPart[2]]['HasAccessories'] = PathPart[3]
								} else if(key == MostRecentFolder) {
									Database[PathPart[2]]['xml_error_unwanted_file'] = Config.ErrorMessage.UnwantedXMLFileThere + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + PathPart[3]
								}
							} else if (NbOfLvl == 5) {	// Only Fixture XML file & Xslt
								if(typeof Database[PathPart[2]] !== 'object') {
									Database[PathPart[2]] = {}
								}
								if(typeof Database[PathPart[2]][PathPart[3]] !== 'object') {
									Database[PathPart[2]][PathPart[3]] = {}
								}
								let FileDetail = PathPart[4].split('.', 2)
								if(FileDetail[1].toLowerCase() == 'xml') {
									if(key == MostRecentFolder) {
										// If the file is not personnalities.xml and then the fixture name is different than the fixture name in the xml filename
										if(PathPart[4].toLowerCase() != 'personalities.xml' && PathPart[4].toLowerCase() != 'accessoriesindex.xml' && PathPart[4] != (PathPart[3] + '.xml')) {
											// Filename different
											if(FileDetail[0] != PathPart[3]) {
												Database[PathPart[2]][PathPart[3]]['xml_error_filename_different'] = Config.ErrorMessage.XMLFilenameNotSameCase + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + FileDetail[0] + ' (found) <> ' + PathPart[3] + ' (expected)'
											}
											// XML Extension in uppercase
											if(FileDetail[1] != 'xml') {
												Database[PathPart[2]][PathPart[3]]['xml_error_extension_uppercase'] = Config.ErrorMessage.XMLExtensionInUpperCase + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + PathPart[4]
											}
										} else if(PathPart[4].toLowerCase() == 'accessoriesindex.xml') {
											Database[PathPart[2]][PathPart[3]]['xml_error_unwanted_file'] = Config.ErrorMessage.UnwantedXMLFileThere + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + PathPart[4]
										}
								}
									if(PathPart[4].toLowerCase() != 'personalities.xml' && PathPart[4].toLowerCase() != 'accessoriesindex.xml') {
										Database[PathPart[2]][PathPart[3]]['xml'] = PathPart[4]
										XMLFixtures.push(files[i])
									} else if (PathPart[4].toLowerCase() == 'personalities.xml') {
										Database[PathPart[2]][PathPart[3]]['HasPersonalities'] = PathPart[4]
									}
								} else if(FileDetail[1].toLowerCase() == 'xslt') {
									if(typeof Database[PathPart[2]][PathPart[3]]['xslt'] !== 'object') {
										Database[PathPart[2]][PathPart[3]]['xslt'] = {}
									}
									Database[PathPart[2]][PathPart[3]]['xslt'][FileDetail[0]] = PathPart[4]
								}
							}
						}
						io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'FileSystem', percentage : 100, description : len + ' files' } )

						// Let's perform some stats analysis from the result
						sortObj(Database)
						let StatsFixtures = {}
						StatsFixtures['Remark'] = ''
						StatsFixtures['NbManufs'] = 0
						StatsFixtures['NbAccessories'] = 0
						StatsFixtures['NbFixtures'] = 0
						StatsFixtures['NbDMXCharts'] = 0
						for(let Manuf in Database) {
							StatsFixtures['NbManufs']++
							if(key == MostRecentFolder && Database[Manuf]['xml_error_unwanted_file']) {
								StatsFixtures['Remark']+= Manuf + ': ' + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Database[Manuf]['xml_error_unwanted_file'] + "\n"
							}
							for(let Fixture in Database[Manuf]) {
								// Remove Fixtures "HasAccessories" which are not fixtures
								if(Fixture != 'HasAccessories') {
									StatsFixtures['NbFixtures']++
									if(typeof StatsFixtures[Manuf] !== 'object') {
										StatsFixtures[Manuf] = {}
									}
									if(StatsFixtures[Manuf]['NbFixtures']) {
										StatsFixtures[Manuf]['NbFixtures']++
									} else {
										StatsFixtures[Manuf]['NbFixtures'] = 1
										StatsFixtures[Manuf]['NbDMXCharts'] = 0
									}
									if(Database[Manuf][Fixture]['xslt']) {
										StatsFixtures[Manuf][Fixture] = Object.keys(Database[Manuf][Fixture]['xslt']).length + 1
										StatsFixtures[Manuf]['NbDMXCharts'] += StatsFixtures[Manuf][Fixture]
										StatsFixtures['NbDMXCharts'] += StatsFixtures[Manuf][Fixture]
									} else {
										StatsFixtures[Manuf][Fixture] = 1
										StatsFixtures[Manuf]['NbDMXCharts']++
										StatsFixtures['NbDMXCharts']++
									}
									if(key == MostRecentFolder && Database[Manuf][Fixture]['xml_error_filename_different']) {
										StatsFixtures['Remark']+= Manuf + ' > ' + Fixture + ' : ' + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Database[Manuf][Fixture]['xml_error_filename_different'] + "\n"
									}
									if(key == MostRecentFolder && Database[Manuf][Fixture]['xml_error_extension_uppercase']) {
										StatsFixtures['Remark']+= Manuf + ' > ' + Fixture + ' : ' + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Database[Manuf][Fixture]['xml_error_extension_uppercase'] + "\n"
									}
									if(key == MostRecentFolder && Database[Manuf][Fixture]['xml_error_unwanted_file']) {
										StatsFixtures['Remark']+= Manuf + ' > ' + Fixture + ' : ' + "\n" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + Database[Manuf][Fixture]['xml_error_unwanted_file'] + "\n"
									}
								} else {
									StatsFixtures['NbAccessories']++
								}
							}
						}
						io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Manufacturers', percentage : 0, description : StatsFixtures['NbManufs'] + ' Manufacturers' } )
						io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Accessories', percentage : 0, description : StatsFixtures['NbAccessories'] + ' Accessories' } )
						io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Fixtures', percentage : 0, description : StatsFixtures['NbFixtures'] + ' Fixtures' } )
						io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Charts', percentage : 0, description : '~' + StatsFixtures['NbDMXCharts'] + ' Charts' } )
						if(key == MostRecentFolder) {
							io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Remark', Remark: StatsFixtures['Remark'].replace(/(\r\n|\n\r|\r|\n)/g, '<br />') })
						}
						return resolve([Database, StatsFixtures])
					})
				})
				.then(PrevData => {
					// Retrieve data from previous promise
					let Database = PrevData[0]
					,	StatsFixtures = PrevData[1]
					,	StatsNow = {}
					if(data[Config.AdminForm.IngestAccessories]) {
						StatsNow['NbAccessories'] = 0
						for(let Manuf in Database) {
							if(Database[Manuf]['HasAccessories']) {
								StatsNow['NbAccessories']++
								io.sockets.emit('TaskProgress', { folder: 'Library-' + key, Type : 'Accessories', percentage : Percentage(StatsNow['NbAccessories'], StatsFixtures['NbAccessories']), description : StatsFixtures['NbAccessories'] + ' Accessories' } )
							}
						}
					}
					if(data[Config.AdminForm.IngestFixture]) {
						StatsAccessories['NbAccessories'] = 0
						for(let Manuf in Database) {
							for(let Fixture in Database[Manuf]) {
							}
						}
					}
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
		res.locals.PageTitle = 'Fixture Finder/Admin - v0.0.1'
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
