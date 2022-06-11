const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: String
    }},
    { timestamps: true});
    const Post = mongoose.model('post', postSchema);
    module.exports = Post; 
