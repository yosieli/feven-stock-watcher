const express=require('express');
const bodyParser=require('body-parser');
const server=express();

const port=process.env.PORT || 5000;
server.use(express.static('public'));
server.use(bodyParser.json());

server.post("/rest/signup",processSignUpRequest);
server.listen(port,serverListener);

function processSignUpRequest(httpRequestObject,httpResponseObject){
    var loginId=httpRequestObject.body.loginId;
    var stockSymbol=httpRequestObject.body.stockSymbol;
    console.log("loginId is:" + loginId);
    console.log("stockSymbol is:" + stockSymbol);

    //mock the response
    httpResponseObject.statusCode=200;
    httpResponseObject.end();
}  


function serverListener(){
    console.log('My Node Server Listening on port 5000');
    
}