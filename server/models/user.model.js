//user.model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login : {
            type : String,
            required : true,
            unique : true
          },
  password : {
              type : String,
              required : true,
              unique : true
             },
  name : String,
  tickets: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    reservedTickets: { type: Number, required: true },
  }]
});

module.exports.schema = userSchema;

const dbConnection = require('../controllers/db.controller');
const Users = dbConnection.model('User',userSchema,'users');

module.exports = Users;
