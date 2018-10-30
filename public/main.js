
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

 //
 //login status
 //

 function userLoggedOut(){
     document.getElementById("loggedInAs").style.visibility="hidden";
     document.getElementById("loginButton").innerHTML='login';
     enableSignUpButton();

     document.getElementById("stockSymbolTextField").value=null;
     document.getElementById("stockTable").style.visibility="hidden";

 }
 function userLoggedIn(theloginId){
     document.getElementById("loggedInAs").style.visibility="visible";
     document.getElementById("loginId").innerHTML=theloginId;
     document.getElementById("loginButton").innerHTML='logout';
     disableSignUpButton();
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
