const express = require('express')
const path = require('path')
const bp = require('body-parser')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const app = express()
app.use(bp.json())

app.use(express.static(__dirname + '/client/dist/client'))


mongoose.connect('mongodb://localhost/stock_db')

const StockSchema = new mongoose.Schema({
    symbol: {type: String, required: true, unique: true},
    name: {type: String},
})
StockSchema.plugin(uniqueValidator, { message: "Symbol is already in use" })


const Stocks = mongoose.model("stocks", StockSchema);

// Get all stocks
app.get('/api/stocks', function(req, res){
    Stocks.find({})
    .then((data)=>res.json(data))
    .catch((errs)=>res.json(errs))
})

//add one stock
app.post('/api/stocks', function(req, res){
    Stocks.create(req.body)
    .then((data)=>res.json(data))
    .catch((errs)=>res.json(errs))
})

//delete one stock
app.delete('/api/stocks/:id', function(req, res){
    Stocks.findByIdAndRemove(req.params.id)
    .then((data)=>res.json(data))
    .catch((errs)=>res.json(errs))
})

//get one stock
app.get('/api/stocks/:id', function(req, res){
    Stocks.findById(req.params.id)
    .then((data)=>res.json(data))
    .catch((errs)=>res.json(errs))
})

//edit one stock
// const opts = { runValidators: true };
app.put('/api/stocks/:id', function (req, res) {
    Stocks.findByIdAndUpdate(req.params.id, req.body)
        .then((data) => res.json(data))
        .catch((errs) => res.json(errs))
})

app.listen(8000, function () {
    console.log('listening')
})
