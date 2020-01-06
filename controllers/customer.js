const docClient = require("../config/DynamoDBDocClient")
const express = require('express')

exports.router = express.Router()

exports.getALLCustomer = function(req, res, next) {
    const scan_param = {
        TableName: "Customer"
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

exports.getCustomer = function(req, res, next) {
    const customer_id = req.params.customer_id
    const query_param = {
        TableName : "Customer",
        KeyConditionExpression: "#pk = :id",
        ExpressionAttributeNames:{
            "#pk": "id"
        },
        ExpressionAttributeValues: {
            ":id": customer_id
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

exports.deleteCustomer = function(req, res, next){
    const customer_id = req.params.customer_id
    console.log(customer_id)
    const delete_param = {
        TableName : "Customer",
        Key: {
            "id": customer_id
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

exports.updateCustomer = function(req, res, next) {
    const body = req.body
    const customer_id = body.id
    const name = body.name
    const email = body.email
    const update_param = {
        TableName : "Customer",
        Key: {
            "id": customer_id
        },
        UpdateExpression: "SET #K1 = :val1, #K2 = :val2",
        ExpressionAttributeNames: {
            "#K1": "name",
            "#K2": "email"
        },
        ExpressionAttributeValues: {
            ":val1": name,
            ":val2": email
        },
        ReturnValues: "ALL_NEW",
        ConditionExpression: "attribute_exists(id)"
    }
    docClient.update(update_param, function(err,data){
        if (err){
            res.status(500).json({error: err.message})
        }
        else{
            res.status(200).send(data)
        }
    })
}

exports.addCustomer = function(req, res, next) {
    const data = req.body
    const add_params = {
        TableName : "Customer",
        Item: data
    ,
    ConditionExpression: "attribute_not_exists(id)"
    }
    docClient.put(add_params, function(err, data){
        if (err) {
            res.status(500).json({error: err.message})
        }
        else {
            res.status(200).send(data)
        }
    })
}
