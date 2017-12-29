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
		//Error Message
			ErrorMessage :						() => {
				return {
					XMLFileNotLikeFixture :				'XML File is not matching exactly the Fixture name'
				}
			},
	//Server Parameter
		SiteName : 						() => { return 'Fixture Finder @nline' },
	//Folders
		FolderMiddlewares : 	() => { return './middlewares' },
		FolderRouters : 			() => { return './site_routers' },
		FolderViews : 				() => { return './views' },
		FolderPublic : 				() => { return './public' },
	//JS Scripts folder alias routing
		FolderJquery : {
			js : 								() => { return './public/bower_components/jquery/dist' }
		},
		FolderSocketIO : {
			js : 								() => { return './public/bower_components/socket.io-client/dist' }
		},
		FolderSelect2 : {
			js :								() => { return './public/bower_components/select2/dist/js' },
			css :								() => { return './public/bower_components/select2/dist/css' }
		},
		FolderFancybox : {
			js :								() => { return './public/bower_components/fancybox/dist/' },
			css :								() => { return './public/bower_components/fancybox/dist/' }
		}
}
