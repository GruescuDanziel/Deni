const mongoose = require('mongoose')

const Alog = mongoose.model('Notebook',
{
    body  : String,
    code : String

});

module.exports = Notebook
