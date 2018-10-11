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

            alert(stockInformation.symbol);
            alert(stockInformation.companyName);

            var tableElemet=document.getElementById("stockTable");
           
            while(tableElemet.rows.length >=1){
                tableElemet.deleteRow(0);
            }
            var row=tableElemet.insertRow();
            row.insertCell().innerHTML="stock Symbol";
            row.insertCell().innerHTML=stockInformation.symbol;

            row=tableElemet.insertRow();
            row.insertCell().innerHTML="company Name";
            row.insertCell().innerHTML=stockInformation.companyName;

            row=tableElemet.insertRow();
            row.insertCell().innerHTML="Latest Price";
            row.insertCell().innerHTML=stockInformation.latestPrice;

            row=tableElemet.insertRow();
            row.insertCell().innerHTML="Primary Exchange";
            row.insertCell().innerHTML=stockInformation.primaryExchange;

            row=tableElemet.insertRow();
            row.insertCell().innerHTML="Sector";
            row.insertCell().innerHTML=stockInformation.sector;






        }
            else{
                alert("something is not quite right.Maybe the stock symbol doest't exist..");

            }
        
    }

