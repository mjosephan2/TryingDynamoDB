const AWS = require("aws-sdk");

const config = {
    region: "ap-southeast-1",
    credentials:{
        accessKeyId: "PRIVATE",
        secretAccessKey: "PRIVATE"
    }
}

AWS.config.update(config)

module.exports = AWS;