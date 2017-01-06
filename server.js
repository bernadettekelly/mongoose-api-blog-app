
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');
const {blogPosts} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;


app.get('/blogPosts', (req, res) => {
	blogPosts
		.find()
		.exec()
		.then(restaurants => {
			res.json({
				blogPosts: blogPosts.map(
					(blogPosts) => blogPosts.apiRepr())
		});
})
.catch(
	err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});
});

app.get('/blogPosts/:id', (req, res) => {
	blogPosts
	.findByID(req.params.id)
	.exec()
	.then(blogPosts =>res.json(blogPosts.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'})
	});

});

	app.post('/blogPosts', (req, res) => {
		const requiredFields = ['title', 'author', 'content', 'created'];
		requiredFields.forEach(field => {
			if (! (field in req.body && req.bod[field])) {
				return res.status(400).json({message: 'Must specify value for ${field}'
			}
		});
	blogPosts
	.create({
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		created: req.body.created})
	.then(
		blogPosts => res.status(201).json(blogPosts.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message:'Internal server error'});
	});

	app.put('/blogPosts/:id', (req, res) => {
		if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
			const message = (
				`Request path id (${req.params.id}) and request body id ` +
				`(${req.body.id}) must match`);
			console.error(message);
			res.status(400).json({message: message});
		}

		const toUpdate = {};
		const updateableFields = ['title', 'author', 'content', 'created'];

		updateableFields.forEach(field => {
			if (field in req.body) {
				toUpdate[field] = req.body[field];
			}
		});
		blogPosts
		.findByIDAndUpdate(req.params.id, {$set: toUpdate})
		.exec()
		.then(blogPosts => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

	app.delete('/blogPosts/id:', (req, res) => {
		blogPosts
		findByIDAndRemove(req.params.id)
		.exec()
		.then(() => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

	let server;
	function runServer(databaseUrl=DATABASE_URL, port=PORT) {
		return new Promise((resolve, reject) => {
			if (err) {
				return reject(err);
            }
            server = app.listen(port, () => {
            	console.log(`Your app is listening on port ${port}`);
            	resolve();
            })
            .on('error', err => {
            	mongoose.disconnect();
            	reject(err);
		});
	});
  
    function closeServer() {
    	return mongoose.disconnect().then(() => {
    		return new Promise((resolve, reject) => {
    			console.log('Closing server');
    			server.close(err => {
    				if (err) {
    					return reject(err);
    				}
    				resolve();
    			});
    		});
    	});
    }

    if (require.main === module) {
    	runServer().catch(err => console.error(err));
    };

    module.exports = {runServer, app, closeServer}; 