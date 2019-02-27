var AWS = require('aws-sdk');
const uuid = require("uuid/v1");

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

function createStatusTable() {
  var params = {
    TableName: tablePrefix + 'status',
    KeySchema: [
      { AttributeName: 'category', KeyType: 'HASH'},
      { AttributeName: 'statusid', KeyType: 'RANGE'}
    ],
    AttributeDefinitions: [
      { AttributeName: 'category', AttributeType: 'S'},
      { AttributeName: 'statusid', AttributeType: 'S'}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };
  return dynamodb.createTable(params).promise();
}

function populateStatusTable() {
  var params = {
    'RequestItems': {
      'agile.status': [
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'backlog' },
              'statusid': { S: uuid() },
              'code': { S: 'active' },
              'description': { S: 'Active'},
              'initial': { BOOL: true }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'backlog' },
              'statusid': { S: uuid() },
              'code': { S: 'cancelled' },
              'description': { S: 'Cancelled'},
              'initial': { BOOL: false }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'backlog' },
              'statusid': { S: uuid() },
              'code': { S: 'workflow' },
              'description': { S: 'Workflow'},
              'initial': { BOOL: false }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'workflow' },
              'statusid': { S: uuid() },
              'code': { S: 'ready' },
              'description': { S: 'Ready'},
              'initial': { BOOL: true }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'workflow' },
              'statusid': { S: uuid() },
              'code': { S: 'inprogress' },
              'description': { S: 'In Progress'},
              'initial': { BOOL: false }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'workflow' },
              'statusid': { S: uuid() },
              'code': { S: 'done' },
              'description': { S: 'Done'},
              'initial': { BOOL: false }
            }
          }
        },        
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'workflow' },
              'statusid': { S: uuid() },
              'code': { S: 'cancelled' },
              'description': { S: 'Cancelled'},
              'initial': { BOOL: false }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'goal' },
              'statusid': { S: uuid() },
              'code': { S: 'onhold' },
              'description': { S: 'On Hold'},
              'initial': { BOOL: true }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'goal' },
              'statusid': { S: uuid() },
              'code': { S: 'active' },
              'description': { S: 'Active'},
              'initial': { BOOL: false }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'goal' },
              'statusid': { S: uuid() },
              'code': { S: 'completed' },
              'description': { S: 'Completed'},
              'initial': { BOOL: false }
            }
          }
        },        
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'goal' },
              'statusid': { S: uuid() },
              'code': { S: 'cancelled' },
              'description': { S: 'Cancelled'},
              'initial': { BOOL: false }
            }
          }
        },        
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'note' },
              'statusid': { S: uuid() },
              'code': { S: 'active' },
              'description': { S: 'Active'},
              'initial': { BOOL: true }
            }
          }
        },
        {
          'PutRequest': {
            'Item': {
              'category': { S: 'note' },
              'statusid': { S: uuid() },
              'code': { S: 'deleted' },
              'description': { S: 'Deleted'},
              'initial': { BOOL: false }
            }
          }
        }        
      ]
    }
  }
  return dynamodb.batchWriteItem(params).promise()
}

function done() {
  console.log('Table creation completed');
}

createUserTable()
.then(createGoalTable())
.then(createStatusTable())
.then(populateStatusTable())
.then(done); 

//createStatusTable()
//  .then(populateStatusTable())
//  .then(done());

//populateStatusTable()
//  .catch(reason => console.log(reason));  

