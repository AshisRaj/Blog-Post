const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateFormat = require('dateformat');
const moment = require('moment')

// create a schema
const CommentSchema = new Schema({
    name: { type: String, trim: true, index: true },
    email: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now }
});

// create a schema
var PostSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String },
    body: { type: String, required: true, exclude: true, allowOnUpdate: false },
    author: { type: String, default: 'Anonymus' },
    comments: [CommentSchema]
}, {timestamps: true});

PostSchema.virtual("publishedAt").get(function() {
    return dateFormat(this.createdAt, "ddd, mmm dS, yyyy");
});
  
PostSchema.virtual("publishedSince").get(function() {
    return moment(this.createdAt).fromNow()
});

CommentSchema.virtual("commentAddedSince").get(function() {
    return moment(this.createdAt).fromNow()
});

// the schema is useless so far
// we need to create a model using it
const Post = mongoose.model('Post', PostSchema);

// make this available to our users in our Node applications
module.exports = Post;