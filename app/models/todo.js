var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	title : {type : String, default: ''},
    desc : {type : String, default: ''},
    dates : {type : String, default: ''},
    timing : {type : String, default: ''},
    nominee : {type : String, default: ''}
});