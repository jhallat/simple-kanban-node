var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

var dynamodb = new AWS.DynamoDB();
var tablePrefix = 'agile.';

function createUserTable() {
  var params = {
    TableName: tablePrefix + 'user',
    KeySchema: [
      {
        AttributeName: 'userid',
        KeyType: 'HASH'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userid',
        AttributeType: 'S'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };
  var promise = dynamodb.createTable(params).promise();
  return promise;
}

function done() {
  console.log('Table creation completed');
}

createUserTable().then(done); 