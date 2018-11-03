const express=require('express');
const bodyParser=require('body-parser');
const {Client}=require('pg');
const server=express();

const port=process.env.PORT || 5000;

const postgresClient=initializedPostgreSqlClient();
server.use(express.static('public'));
server.use(bodyParser.json());

server.post("/rest/signup",processSignUpRequest);
server.get("/rest/login/:loginId",processLoginRequest);
server.post("/rest/updateStockSymbol",processUpdateStockSymbol);
server.listen(port,serverListener);

function processUpdateStockSymbol(httpRequestObject,httpResponseObject){
    var loginId=httpRequestObject.body.loginId;
    var stockSymbol=httpRequestObject.body.stockSymbol;
    console.log("loginId is:" + loginId);
    console.log("stockSymbol is:" + stockSymbol);

    var sqlString="update  \"stock-watcher-users\" set stock_symbol= '" + stockSymbol + "'where login_id = '" + loginId + "'";
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

function processLoginRequest(httpRequestObject,httpResponseObject){
    //url example:/rest/login/luis
    var loginId=httpRequestObject.param("loginId");
    var sqlString="SELECT * from  \"stock-watcher-users\"  where login_id='"+ loginId +"'";

    postgresClient.query(sqlString,function(error,result){
        if(error){
            console.log(error);
            httpResponseObject.status=500;
            httpResponseObject.end();
        }else{
            console.log(result);
            if(result.rowCount ===1){
                //we found the users login id!
                var responseObject=result.rows[0];
                var jsonString =JSON.stringify(responseObject);
                jsonString=jsonString.replace("login_id","loginId").replace("stock_symbol","stockSymbol");

                httpResponseObject.statusCode=200;
                httpResponseObject.end(jsonString);

            }else{
                //we didn't find the user's login id
                httpResponseObject.status=500;
                httpResponseObject.end();
            }

        }
    });
}

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