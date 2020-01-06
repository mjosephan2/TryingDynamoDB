const docClient = require("../config/DynamoDBDocClient")
const express = require('express')
const uuidv4 = require("uuid/v4")
exports.router = express.Router()

exports.getALLProduct = function(req, res, next) {
    const scan_param = {
        TableName: "Product"
    }
    docClient.scan(scan_param, function(err,data){
        if (err){
            res.status(500).json({error: err.message})
        }
        else {
            res.status(200).send(data.Items)
        }
    })
}

exports.getProduct = function(req, res, next) {
    const product_id = req.params.product_id
    const query_param = {
        TableName : "Product",
        KeyConditionExpression: "#pk = :id",
        ExpressionAttributeNames:{
            "#pk": "id"
        },
        ExpressionAttributeValues: {
            ":id": product_id
        }
    }
    docClient.query(query_param, function(err,data){
        if (err){
            res.status(500).json({error: err.message})
        }
        else {
            res.status(200).send(data.Items)
        }
    })
}

exports.deleteProduct = function(req, res, next){
    const product_id = req.params.product_id
    const delete_param = {
        TableName : "Product",
        Key: {
            "id": product_id
        },
        ConditionExpression: "attribute_exists(id)"
    }
    docClient.delete(delete_param, function(err,data){
        if (err){
            res.status(500).json({error:err.message})
        }
        else{
            console.log(data)
            res.status(200).send("Delete successful")
        }
    })
}

exports.updateProduct = function(req, res, next) {
    const updated_product_data = req.body
    const update_param = {
        TableName : "Product",
        Item: updated_product_data,
        ReturnValues: "NONE",
        ConditionExpression: "attribute_exists(id)"
    }
    docClient.put(update_param, function(err,data){
        if (err){
            res.status(500).json({error: err.message})
        }
        else{
            res.status(200).send("Data is updated")
        }
    })
}

exports.addProduct = function(req, res, next) {
    const uuid = uuidv4()
    var data = req.body
    
    data.id = uuid
    const add_params = {
        TableName : "Product",
        Item: data
    }
    docClient.put(add_params, function(err, data){
        if (err) {
            res.status(500).json({error: err.message})
        }
        else {
            res.status(200).send("New product added")
        }
    })
}

// previous code
const uuid = uuidv4()
var write = {
    TableName : "Product",
    Item:{
        "id": `${uuid}`,
        "product_name": "SUTD ring",
        "product_size": "9",
        "product_price": "20",
        "stock": "18"
    },
    ConditionExpression: "attribute_not_exists(PK) and attribute_not_exists()"
}
