const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema({
    comment : {
        type: String
    },

      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;