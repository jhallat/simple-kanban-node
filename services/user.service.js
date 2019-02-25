const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const uuid = require("uuid/v1");
const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports = {
  authenticate,
  addUser,
  findUserByBearerToken
};

const saltRounds = 10;
aws.config.update({
  region: "us-east-1"
});
var dynamodb = new aws.DynamoDB();
var privateKey = fs.readFileSync("./private.key", "utf8");
var publicKey = fs.readFileSync("./public.key", "utf8");

async function authenticate(username, password, callback) {

  findUserByUsername(username).then(
    data => {
      if (data.Items && data.Items.length === 1) {
        var hash = data.Items[0].password.S;
        var isValid = bcrypt.compareSync(password, hash);
        if (isValid) {
          var signOptions = {
            issuer: "simple-kanban-node",
            subject: username,
            algorithm: "RS256"
          };
          var token = jwt.sign({}, privateKey, signOptions);
          callback(null, { user: username, bearerToken: token });
        } else {
          callback({ code: 401, message: "invalid credentials" });
        }
      } else {
        callback({ code: 401, message: "invalid credentials" });
      }
    },
    err => {
      callback({ code: 500, message: err });
    }
  )

}

function findUserByUsername(username) {
  var params = {
    TableName: "agile.user",
    IndexName: "agile.usernameindex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": { S: username }
    }
  };

  return dynamodb.query(params).promise();
}

function getBearerTokenFromHeader(headers) {
  return new Promise((resolve, reject) => {
    var tokenArray = headers.authorization.split(" ");
    if (tokenArray.length !== 1) {
      reject(new Error("Token not found"));
    } else {
      jwt.verify(tokenArray[1], publicKey, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.sub);
        }
      })
    }
  })
}


function findUserByBearerToken(headers) {
  
  return new Promise((resolve, reject) => {
    getBearerTokenFromHeader(headers).then(
      (data) => {
        findUserByUsername(data.sub, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(null, data.userid);
          }
        })
      },
      (error) => {
        reject(error);
      }
    )
  })
}

async function addUser(user, callback) {
  findUserByUsername(user.username, (err, data) => {
    if (err) {
      if (err.code !== "ResourceNotFoundException") {
        console.error("Error ", JSON.stringify(err, null, 2));
        callback(err);
      }
    } else {
      if (data.Items && data.Items.length > 0) {
        console.error(`Username '${user.username}' already exists`);
        callback(`Username '${user.username}' already exists`);
      } else {
        var hash = bcrypt.hashSync(user.password, saltRounds);
        let userid = uuid();
        var params = {
          TableName: "agile.user",
          Item: {
            userid: { S: userid },
            username: { S: user.username },
            password: { S: hash }
          }
        };
        dynamodb.putItem(params, (err, data) => {
          if (err) {
            callback(err, {});
          } else {
            callback(null, {
              userid: userid,
              username: user.username,
              password: ""
            });
          }
        });
      }
    }
  });
}
