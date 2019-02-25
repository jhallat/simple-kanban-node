const aws = require("aws-sdk");

module.exports = {
  findByUserId
}

aws.config.update({
  region: "us-east-1"
});
var dynamodb = new aws.DynamoDB();

function findByUserId(userid) {
  var params = {
    TableName: 'agile.goal',
    KeyConditionExpression: 'userid = :userid',
    ExpressionAttributeValues: {
      ':userid': { S: userid }
    }
  };
  return dynamodb.query(params, callback);
}