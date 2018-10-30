const express=require('express');
const bodyParser=require('body-parser');
const {Client}=require('pg');
const server=express();

const port=process.env.PORT || 5000;

const postgresClient=initializedPostgreSqlClient();
server.use(express.static('public'));
server.use(bodyParser.json());

server.post("/rest/signup",processSignUpRequest);
server.listen(port,serverListener);

function processSignUpRequest(httpRequestObject,httpResponseObject){
    var loginId=httpRequestObject.body.loginId;
    var stockSymbol=httpRequestObject.body.stockSymbol;
    console.log("loginId is:" + loginId);
    console.log("stockSymbol is:" + stockSymbol);

    var sqlString="insert into \"stock-watcher-users\" values('" + loginId + "','" + stockSymbol +"')";
    console.log(sqlString);

    postgresClient.query(sqlString,function(error,result){
        if(error){
            console.log(error);
            httpResponseObject.statusCode=500;
            httpResponseObject.end();

        }
        else{
            console.log(result);
            httpResponseObject.status=200;
            httpResponseObject.end();
        }
    });

    
}  


function serverListener(){
    console.log('My Node Server Listening on port 5000');
    
}
function initializedPostgreSqlClient(){
    var postgresClientConfiguration;
    if(process.env.DATABASE_URL===undefined){
    postgresClientConfiguration={
        connectionString:'postgres://postgres:admin@localhost:5432/postgres'
    }
}else{
    postgresClientConfiguration={
        connectionString: process.env.DATABASE_URL,
        ssl:true
    }
}
    var postgresClient=new Client(postgresClientConfiguration);
    console.log('connecting to postgres,');
    postgresClient.connect();
    console.log('connected to postgres!');
    return postgresClient;
}