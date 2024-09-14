//item.model
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  capacity : {
            type : Number,
            default : 0
          },  
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
module.exports.schema = itemSchema;

const dbConnection = require('../controllers/db.controller');
const Items = dbConnection.model('Item',itemSchema,'items');

module.exports = Items;
