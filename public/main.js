
/*** 
 * signup
 */

 function disableSignUpButton(){
     var signUpButton=document.getElementById("SignUpButton");
     signUpButton.disabled=true;
     signUpButton.style.borderColor="grey";
 }

 function enableSignUpButton(){
    var signUpButton=document.getElementById("SignUpButton");
    signUpButton.disabled=false;
    signUpButton.style.borderColor="black";

 }

 function signUpButton(event){
    // alert("will show sign up dialog here");
    showSignUpDialog();
 }

 function showSignUpDialog(){
     document.getElementById("signUpIdTextBox").value=null;
     document.getElementById("signUpDialog").showModal();
 }

 function signUpDialogSignUpButtonClicked(){
      // alert("Will sign up");
       var loginIdString=document.getElementById('signUpIdTextBox').value;
       var stockSymbol=document.getElementById('stockSymbolTextField').value;
       var webServiceRequest=new XMLHttpRequest();
       webServiceRequest.open("POST","/rest/signup");
       webServiceRequest.setRequestHeader("Content-Type","application/json");
       webServiceRequest.onload=function(){
           if(this.status===200){
               //alert("Got 200!");
               document.getElementById("signUpDialog").close();
               userLoggedIn(loginIdString);
           }
           else{
               alert("Some error ocurred.Maybe login id already exists.");
           }
           }
       

       var jsonObject={
           "loginId":loginIdString,
           "stockSymbol":stockSymbol
       }

       var jsonString=JSON.stringify(jsonObject);
       webServiceRequest.send(jsonString);




 }

 function signUpDialogCancelButtonClicked(){
     document.getElementById("signUpDialog").close();
     
 }

 //
 //login dialog
 //
 function loginButtonClicked(){
     var loginButtonText=document.getElementById("loginButton").innerHTML;
     if(loginButtonText==='logout'){
         userLoggedOut();
     }else{
         //alert('will  show login dialog');
         showLoginDialog();

     }

     }
     function showLoginDialog(){
        document.getElementById("loginIdTextBox").value=null;
         document.getElementById("loginDialog").showModal();
         
     }
     function loginDialogCancelButtonClicked(){
         document.getElementById("loginDialog").close();
     }

     function loginDialogLoginButtonClicked(){
         var loginID=document.getElementById("loginIdTextBox").value;
         var webServiceRequest=new XMLHttpRequest();
         webServiceRequest.open("GET","/rest/login/" + loginID);
         webServiceRequest.onload=function(){
             if(this.status===200){
                 document.getElementById("loginDialog").close();
                 var responseObject=JSON.parse(webServiceRequest.responseText);
                 var stockSymbol=responseObject.stockSymbol;
                 userLoggedIn(loginID);
                 if(stockSymbol.length > 0){
                     document.getElementById("stockSymbolTextField").value=stockSymbol;
                     getAndDisplayStockDate(stockSymbol);
                    
                 }
             }else{
                 alert("unable to login.Maybe login id is incorrect");
             }
         }
         webServiceRequest.send();
     }

 //
 //login status
 //

 function userLoggedOut(){
     document.getElementById("loggedInAs").style.visibility="hidden";
     document.getElementById("loginButton").innerHTML='login';
      // NEW CODE BEGIN
    document.getElementById("loginId").innerHTML = '';
    // NEW CODE END
     enableSignUpButton();

     document.getElementById("stockSymbolTextField").value=null;
     document.getElementById("stockTable").style.visibility="hidden";

     // NEW CODE BEGIN
    document.getElementById("stockChartCanvas").style.visibility = "hidden";
    // NEW CODE END

 }
 function userLoggedIn(theloginId){
     document.getElementById("loggedInAs").style.visibility="visible";
     document.getElementById("loginId").innerHTML=theloginId;
     document.getElementById("loginButton").innerHTML='logout';
     disableSignUpButton();
 }

 function isUserLoggedIn(){
     var loggedInId=document.getElementById("loginId").innerHTML;
     if(loggedInId.length !=0){
         return true;
     }else{
         return false;
     }
 }
 function getLoggedInUserId(){
     return document.getElementById("loginId").innerHTML;
 }

 //
 // stock symbol search box
 //

function stockSymbolSearchBoxKeyPressed(keyboardEvent){
    if(keyboardEvent.key==="Enter"){
        //get price form a web service
        
        console.log("Enter was pressed");
        var stockSymbol=keyboardEvent.target.value;
        getAndDisplayStockDate(stockSymbol);

        if(isUserLoggedIn()){
            var loggedInUserId=getLoggedInUserId();
            updateUserStockSymbol(loggedInUserId,stockSymbol);

            }
        }
        

    }

    function updateUserStockSymbol(loginId,stockSymbol){
        alert("will call rest service " + loginId + " " + stockSymbol);

        var webServiceRequest=new XMLHttpRequest();

        webServiceRequest.open("POST","/rest/updateStockSymbol")
        webServiceRequest.setRequestHeader("Content-Type","application/json");

        webServiceRequest.onload=function(){
            if(this.status==200){
                console.log("updated stock");
            }
            else{
                console.log("some error occured updating stock");
            }
        }
        var jsonString=JSON.stringify({"loginId":loginId,"stockSymbol":stockSymbol});
        webServiceRequest.send(jsonString);

    }

    function getAndDisplayStockDate(stockSymbol){
        var webServiceRequest=new XMLHttpRequest();
        webServiceRequest.open("GET","https://api.iextrading.com/1.0/stock/"+stockSymbol+"/quote");
        webServiceRequest.onload=currentStockInfoResponseHandler;
        webServiceRequest.send();
        // NEW CODE BEGIN 
    getCurrentStockInfo(stockSymbol);
    getHistoricalStockInfo(stockSymbol);
    // NEW CODE END

    // NEW CODE BEGIN 
/* call a third party REST web service to get the stock's current info (e.g. current price) */ 
function getCurrentStockInfo(stockSymbol) {

    // note to students: the following four lines used to be in function getAndDisplayStockData (above)
    var webServiceRequest = new XMLHttpRequest();
    webServiceRequest.open("GET","https://api.iextrading.com/1.0/stock/" + stockSymbol + "/quote");
    webServiceRequest.onload = currentStockInfoResponseHandler;
    webServiceRequest.send();
}
// NEW CODE END

    }
    function currentStockInfoResponseHandler(){
        console.log(this.status);
        console.log(this.responseText);
        if(this.status===200){
            //populate our html table

            var stockInformation=JSON.parse(this.responseText);

           /* alert(stockInformation.symbol);
            alert(stockInformation.companyName);*/

            var tableElemet=document.getElementById("stockTable");
             tableElemet.style.visibility="visible";
           
            while(tableElemet.rows.length >=1){
                tableElemet.deleteRow(0);
            }
            insertRow(tableElemet,"stock Symbol",stockInformation.symbol);
            insertRow(tableElemet,"company Name",stockInformation.companyName);
            insertRow(tableElemet,"Latest Price",stockInformation.latestPrice);
            insertRow(tableElemet,"Primary Exchange",stockInformation.primaryExchange);
            insertRow(tableElemet,"Sector",stockInformation.sector);




        }
            else{
                alert("something is not quite right.Maybe the stock symbol doest't exist..");

            }
        
    }


    function insertRow(tableElement,cell1Text,cell2Text){
        var row=tableElement.insertRow();
        row.insertCell().innerHTML=cell1Text;
        row.insertCell().innerHTML=cell2Text;
    }

    /* call a third party REST web service to get the stock's historical info 
   (e.g. daily stock price for the last year) */ 
function getHistoricalStockInfo(stockSymbol) {
    var webServiceRequest = new XMLHttpRequest();
    
    webServiceRequest.onload = function() { 
        historicalStockInfoResponseHandler(webServiceRequest, stockSymbol);
    }
    webServiceRequest.open("GET","https://api.iextrading.com/1.0/stock/" + stockSymbol + "/chart/1y", true);
    
    webServiceRequest.send();
}

function historicalStockInfoResponseHandler(webServiceRequest, stockSymbol) {
    
    if (webServiceRequest.status === 200) { 

        console.log(webServiceRequest.responseText);

        var stockPricesArray = JSON.parse(webServiceRequest.responseText); //returns an array of javascript objects
        console.log(stockPricesArray);

        drawHistoricalPricesChart(stockSymbol, stockPricesArray)
    } 
    else {
        alert("Something went wrong getting historical data");
    }
}

function drawHistoricalPricesChart(stockSymbol, stockPricesArray) {

    var config = {
        type: 'line',
        data: {
            labels: getXAxisLabels(stockPricesArray),
            datasets: [{
                label: stockSymbol,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgb(75, 192, 192)",
                data: getYAxisPricesPrices(stockPricesArray),
                fill: false,
            }]
        }
    };
   
    // display the stock chart container in case it is hidden
    document.getElementById("stockChartCanvas").style.visibility = "visible";

    if (chartObject !== undefined ) {
        // we previously created a chart so let's destroy it before creating a new one
        chartObject.destroy();
    }
    
    var ctx = document.getElementById('stockChartCanvas').getContext('2d');
    chartObject = new Chart(ctx, config);
}

/* return an array containing the x-axis labels */
function getXAxisLabels(stockPricesArray) {
    var labelsArray = new Array();

    stockPricesArray.forEach(element => {
        labelsArray.push(element.date);
    });

    return labelsArray;
}

/* return an array containing the closing prices */
function getYAxisPricesPrices(stockPricesArray)
{
    var historicalClosingPricesArray = new Array();

    stockPricesArray.forEach(element => {
        historicalClosingPricesArray.push(element.close);
    });

    return historicalClosingPricesArray;
}

var chartObject; 

//new code ends//
