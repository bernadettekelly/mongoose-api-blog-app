const mongoose = require('mongoose');

const blogPostsSchema = mongoose.Schema({

	title: {type: String, required: true},
	author: {
		firstName: String,
		lastname: String
	},
	content: {type: String, required: true},
	created: {date: Date, required: true}
});
 
blogPostsSchema.virtual('title').get(function() {
	return `${this.title}`.trim();
});

blogPostsSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		author: this.author,
		content: this.content,
		created: this.created
    };
}

const blogPosts = mongoose.model('blogPosts', blogPostsSchema);
module.exports = {blogPosts};