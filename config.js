module.exports = {
	//Client Parameter
		HttpPort :						() => { return '8080' },
	//Client Form Parameter
		AdminForm :						() => {
			return {
				IngestAllLibraries :				'IngestAllLibraries',
				IngestAccessories :					'IngestAccessories',
				IngestFixture :							'IngestFixture',
				UpdateFixtureAccessories :	'UpdateFixtureAccessories',
				ComputeFixtureChangelog :		'ComputeFixtureChangelog'
			}
		},
		//Fixture Library Releases Message
			FixtureLibraryReleases :	() => {
				return {
					'2014-07-14' :				'm-pc/2014-07-14-FixtureLibrary/',
					'2014-09-10' :				'm-pc/2014-09-10-FixtureLibrary/',
					'2014-11-01' :				'm-pc/2014-11-01-FixtureLibrary/',
					'2014-11-14' :				'm-pc/2014-11-14-FixtureLibrary/',
					'2015-02-23' :				'm-pc/2015-02-23-FixtureLibrary/',
					'2015-05-24' :				'm-pc/2015-05-24-FixtureLibrary/',
					'2015-06-20' :				'm-pc/2015-06-20-FixtureLibrary/',
					'2015-10-01' :				'm-pc/2015-10-01-FixtureLibrary/',
					'2015-12-17' :				'm-pc/2015-12-17-FixtureLibrary/',
					'2016-03-01' :				'm-pc/2016-03-01-FixtureLibrary/',
					'2016-07-11' :				'm-pc/2016-07-11-FixtureLibrary/',
					'2016-08-24' :				'm-pc/2016-08-24-FixtureLibrary/',
					'2016-10-17' :				'm-pc/2016-10-17-FixtureLibrary/',
					'2017-01-26' :				'm-pc/2017-01-26-FixtureLibrary/',
					'2017-04-06' :				'm-pc/2017-04-06-FixtureLibrary/',
					'2017-07-13' :				'm-pc/2017-07-13-FixtureLibrary/',
					'2017-09-17' :				'm-pc/2017-09-17-FixtureLibrary/',
					'2017-11-28' :				'm-pc/2017-11-28-FixtureLibrary/'
				}
			},
		//Error Message
			ErrorMessage :						() => {
				return {
					XMLFileNotLikeFixture :				'XML File is not matching exactly the Fixture name'
				}
			},
	//Server Parameter
		SiteName : 						() => { return 'Fixture Finder @nline' },
	//Folders
		FolderMiddlewares : 	() => { return '/middlewares' },
		FolderRouters : 			() => { return '/site_routers' },
		FolderViews : 				() => { return '/views' },
		FolderPublic : 				() => { return '/public' },
	//JS Scripts folder alias routing
		FolderJquery : {
			js : 								() => { return '/public/bower_components/jquery/dist' }
		},
		FolderSocketIO : {
			js : 								() => { return '/public/bower_components/socket.io-client/dist' }
		},
		FolderSelect2 : {
			js :								() => { return '/public/bower_components/select2/dist/js' },
			css :								() => { return '/public/bower_components/select2/dist/css' }
		},
		FolderFancybox : {
			js :								() => { return '/public/bower_components/fancybox/dist/' },
			css :								() => { return '/public/bower_components/fancybox/dist/' }
		}
}
