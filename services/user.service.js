const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const uuid = require("uuid/v1");
const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports = {
  authenticate,
  addUser
};

const saltRounds = 10;
aws.config.update({
  region: "us-east-1"
});
var dynamodb = new aws.DynamoDB();
var privateKey = fs.readFileSync("./private.key", "utf8");

async function authenticate(username, password, callback) {
  findUserByUsername(username, (err, data) => {
    if (err) {
      callback({ code: 500, message: err });
    } else {
      if (data.Items && data.Items.length === 1) {
        var hash = data.Items[0].password.S
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
    }
  });

  const user = users.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ sub: user.id }, "replace");
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token
    };
  }
}

function findUserByUsername(username, callback) {
  var params = {
    TableName: "agile.user",
    IndexName: "agile.usernameindex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": { S: username }
    }
  };

  return dynamodb.query(params, callback);
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
