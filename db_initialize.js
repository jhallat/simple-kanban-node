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
      { AttributeName: 'userid', KeyType: 'HASH' },
      { AttributeName: 'username', KeyType: 'RANGE'}
    ],
    AttributeDefinitions: [
      { AttributeName: 'userid', AttributeType: 'S' },
      { AttributeName: 'username', AttributeType: 'S'}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    GlobalSecondaryIndexes: [{
      IndexName: tablePrefix + 'usernameindex',
      KeySchema: [
        {AttributeName: "username", KeyType: 'HASH'}
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }]
  };
  var promise = dynamodb.createTable(params).promise();
  return promise;
}

function createGoalTable() {
  var params = {
    TableName: tablePrefix + 'goal',
    KeySchema: [
      { AttributeName: 'userid', KeyType: 'HASH' },
      { AttributeName: 'goalid', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userid', AttributeType: 'S' },
      { AttributeName: 'goalid', AttributeType: 'S' }      
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

createUserTable()
.then(createGoalTable)
.then(done); 

