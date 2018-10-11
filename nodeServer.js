const express=require('express');
const server=express();

const port=process.env.PORT || 5000;
server.use(express.static('public'));

server.listen(port,serverListener);

function serverListener(){
    console.log('My Node Server Listening on port 5000');
    
}