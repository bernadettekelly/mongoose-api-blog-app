const mongoose = require('mongoose');

const blogPostsSchema = mongoose.Schema({

	title: {type: String, required: true},
	author: {type: String, required: true},
	content: {type: String, required: true},
	created: {date: Date, required: true}
});
 
		