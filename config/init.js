const AWS = require("aws-sdk");

const config = {
    region: "ap-southeast-1",
    credentials:{
        accessKeyId: "AKIA4756MKT7H5ELKMOE",
        secretAccessKey: "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"
    }
}

AWS.config.update(config)

module.exports = AWS;