let express = require('express')
let app = express()
let router = express.Router()
let bodyParser = require('body-parser')
let Config = require('../config.js')
let sleep = require('system-sleep');

app.use(require( '.' + Config.FolderMiddlewares() + '/flash.js'))

// create application/json parser
let jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

router.route('/admin')
	.get((req, res) => {
		res.render('index', { Page : 'admin', SiteName : Config.SiteName(), PageTitle : 'Administration - Fixture Finder @nline' }, (err, html) => {
			if(err) {
		  	res.status(500).send(err).end()
			} else {
				res.status(200).send(html).end()
			}
		})
	})
	.post(urlencodedParser, (req, res) => {
		let Inputs = {}
		let InputsSize = Object.keys(req.body).length
		console.log(req.body);
		if(!req.body || InputsSize == 2) {
			Inputs.Status = 'Nothing selected'
		} else {
			Inputs.Status = 'On Going'
		}
		res.locals.Page = 'admin'
		res.locals.SiteName = Config.SiteName()
		res.locals.PageTitle = 'Administration - Fixture Finder @nline'

		res.render('index', { Input : Inputs }, (err, html) => {
			if(err) {
		  	res.status(500).send(err).end()
			} else {
				res.status(200).send(html).end()
			}
		})
	})

module.exports = router
