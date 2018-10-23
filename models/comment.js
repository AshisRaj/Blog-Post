const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require('moment')

// create a schema
const CommentSchema = new Schema({
    name: { type: String, trim: true, index: true },
    email: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now }
});


CommentSchema.virtual("commentAddedSince").get(function() {
    return moment(this.createdAt).fromNow()
});

// the schema is useless so far
// we need to create a model using it
const Comment = mongoose.model('Comment', CommentSchema);

// make this available to our users in our Node applications
module.exports = Comment;