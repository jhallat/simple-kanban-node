const aws = require('aws-sdk');

module.exports = {
  findStatusByCategory
}

aws.config.update({
  region: "us-east-1"
});
var documentClient = new aws.DynamoDB.DocumentClient();

function findStatusByCategory(category) {
  var params = {
    TableName: 'agile.status',
    KeyConditionExpression: 'category = :category',
    ExpressionAttributeValues: {
       ':category': category 
      }
    }

  return documentClient.query(params).promise();
}