const mongoose = require('mongoose')

const Notebook = mongoose.model('Notebook',
{
    owner : String,
    body  : String,
    title : String,
    code : Boolean

});

module.exports = Notebook
