/*
var person= {
    firstName:"luis",
    lastName:"vega",
    walk:function(){
        console.log("I am wlaking");
    }
}

var theLastname=person.lastName;
person.walk();
console.log(theLastname);
*/



/*** 
 * signup
 */

 function signUpButton(event){
    // alert("will show sign up dialog here");
    showSignUpDialog();
 }

 function showSignUpDialog(){
     document.getElementById("signUpDialog").showModal();
 }

 function signUpDialogSignUpButtonClicked(){
       alert("Will sign up");
       var loginIdString=document.getElementById('signUpIdTextBox').value;
       var stockSymbol=document.getElementById('stockSymbolTextField').value;
       var webServiceRequest=new XMLHttpRequest();
       webServiceRequest.open("POST","/rest/signup");
       webServiceRequest.setRequestHeader("Content-Type","application/json");
       webServiceRequest.onload=function(){
           if(this.status===200){
               alert("Got 200!");
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
 // stock symbol search box
 //

function stockSymbolSearchBoxKeyPressed(keyboardEvent){
    if(keyboardEvent.key==="Enter"){
        //get price form a web service
        console.log("Enter was pressed");
        var stockSymbol=keyboardEvent.target.value;
        getAndDisplayStockDate(stockSymbol);

    }
}
    function getAndDisplayStockDate(stockSymbol){
        var webServiceRequest=new XMLHttpRequest();
        webServiceRequest.open("GET","https://api.iextrading.com/1.0/stock/"+stockSymbol+"/quote");
        webServiceRequest.onload=currentStockInfoResponseHandler;
        webServiceRequest.send();
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
