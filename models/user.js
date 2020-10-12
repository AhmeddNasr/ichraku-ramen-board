var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, minlength: 5, maxlength: 100, unique: true, required: true},
    password: {type: String, minlength: 5, maxlength: 100, required: true},
    first_name: {type: String, minlength: 1, maxlength: 100, required: true},
    last_name: {type: String, minlength: 1, maxlength: 100, required: true},
    membership: {type: Boolean, default: false}
})

userSchema.virtual('full_name').get(function() {
    return this.first_name + " " + this.last_name;
})

userSchema.virtual('url').get(function() {
    return 'user/' + this._id;
})

module.exports = mongoose.model('User', userSchema);