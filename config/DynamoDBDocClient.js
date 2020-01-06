const AWS = require("./init")
const documentClient = new AWS.DynamoDB.DocumentClient()
module.exports = documentClient