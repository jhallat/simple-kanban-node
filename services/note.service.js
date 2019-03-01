const aws = require('aws-sdk');

module.exports = {
  findNotesByUserId
}

aws.config.update({
  region: "us-east-1"
});
var documentClient = new aws.DynamoDB.DocumentClient();

function findNotesByUserId(userid) {
  var params = {
    TableName: 'agile.note',
    KeyConditionExpression: 'userid = :userid',
    ExpressionAttributeValues: {
      ':userid': userid
    }
  }
  return documentClient.query(params).promise();
}
