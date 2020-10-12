const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

var messageSchema = new Schema({
    text: {type: String, minlength: 1, maxlength: 300, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: {type: Date, required: true, default: Date.now},
})

messageSchema.virtual('timestamp_formatted').get(function(){
    return moment(this.timestamp).calendar();
});

module.exports = mongoose.model('Message', messageSchema);