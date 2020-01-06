const docClient = require("../config/DynamoDBDocClient")
const express = require('express')
const uuidv4 = require("uuid/v4")

exports.router = express.Router()

exports.getAllOrderByCustomer = function(req, res, next){
    const customer_id = req.params.customer_id
    const query_param = {
        TableName : "Order",
        KeyConditionExpression: "#pk = :val",
        ExpressionAttributeNames:{
            "#pk": "PK"
        },
        ExpressionAttributeValues: {
            ":val": `CUSTOMER#${customer_id}`
        }
    }
    query(query_param)
    .then(data => {
        const PKs = data.Items.map(obj => obj.SK)
        var result = data.Items
        return new Promise((resolve, reject) => {
            counter = PKs.length
            PKs.forEach((PK,index) => {
                const query_param = {
                    TableName : "Order",
                    KeyConditionExpression: "#pk = :val",
                    ExpressionAttributeNames:{
                        "#pk": "PK"
                    },
                    ExpressionAttributeValues: {
                        ":val": PK
                    }
                }
                docClient.query(query_param, function(err, data){
                    if (err)
                        return reject(err)
                    counter--
                    result[index].products = data.Items
                    if (counter==0)
                        resolve(result)
                })
            });
        })
    })
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).json({error: err.message})
    })
}

exports.addOrder = function(req, res, next){
    const data = req.body
    const products = data.products
    const uuid = uuidv4()

    delete data.products
    data.SK = `ORDER#${uuid}`
    const update_product = products.map(product => ({
        Update: {
            TableName: "Product",
            Key: {
                "id": product.product_id
            },
            UpdateExpression: "SET #stock = stock - :val",
            ConditionExpression: "#stock >= :val",
            ExpressionAttributeValues: {
                ":val": {
                    N:product.quantity}
            },
            ExpressionAttributeNames:{
                "#stock": "stock"
            }
        }
    }))

    console.log(data)
    console.log(products)
    console.log("My obj", update_product)
    const transact_param = {
        TransactItems: update_product
    }
    docClient.transactWrite(transact_param, function(err, data){
        if (err){
            res.status(500).json({error:err.message})
            console.error(err)
        }
        else{
            console.log("done transact")
            // add the product now through query
            const order_put_param = {
                TableName: "Order",
                Items: data,
                ConditionExpression: "attribute_not_exists(SK)"
            }
            docClient.put(order_put_param, (err, data) => {
                if (err)
                    return res.status(500).json({error: err.message})
            })
            var counter = products.length
            products.forEach((product, index) => {
                product.PK = `ORDER#${uuid}`
                const product_put_param = {
                    TableName: "Order",
                    Items: product,
                    ConditionExpression: "attribute_not_exists(PK)"
                }
                docClient.put(product_put_param, (err, data)=>{
                    if (err)
                        return res.status(500).json({error: err.message})
                    if (counter == 0){
                        res.status(200).send("Inserting is successful")
                    }
                })
            })
        }
    })
}


// convert callback to promise
const query = (params) => {
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
            if (err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const transact = () => {
    const update_product = products.map(product => ({
        ConditionCheck: {
            TableName: "Product",
            Key: {
                "id": product.product_id
            },
            UpdateExpression: "SET #stock = stock - :val",
            ConditionExpression: "#stock >= :val",
            ExpressionAttributeValues: {
                ":val": {
                    N:product.quantity}
            },
            ExpressionAttributeNames:{
                "#stock": "stock"
            }
        }
    }))
}

// one idea is to create an object class