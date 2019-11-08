// ==UserScript==
// @name         Email Print Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a print button the correspondence list
// @author       Colman Bouton
// @match        *://*/*
// @grant        none
// @update 	https://github.com/LorentzFactor/mercury-userscripts/raw/master/email-print-button.user.js
// @download 	https://github.com/LorentzFactor/mercury-userscripts/raw/master/email-print-button.user.js
// ==/UserScript==

var emailTaken = false;
var printButtonsAdded = false;
(function() {
    'use strict';
	   if (window.location.href.includes("rms-inc.com/CorrespondenceHistory")) {
		    //window.addEventListener('load', addPrintButtons());
           window.addEventListener('load', ()=>{console.log('loaded')});
			document.querySelector("#ShowMeList").onclick(addPrintButtons());
	   }
})();

async function addPrintButtons(){
    try{
        var table = document.querySelector("#CorrespondenceHistoryTable");
        if( table == null || table == {}){
            console.log("tableBody is still null");
            sleeper(1000).then(addPrintButtons);
        }
        else if (!printButtonsAdded){
            //console.log("table: " + table);
            //console.log(table.rows);
            var tableRows = table.rows;
            //skip over first two not used for data
            console.log("length: " + tableRows.length);
            for(var i = 2; i < tableRows.length; i++){
                 addPrintButtonToRow(tableRows[i], i);
            }
            //table.onchange = addPrintButtons();
        }
        //table.onchange = addPrintButtons();
    }
    catch(error){
        console.log(error);
    }
}

function sleeper(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function addPrintButtonToRow(row, i){
    console.log("row added");
	var divelement = row.cells[0].getElementsByTagName("div")[0];
    if(divelement == null)
        console.log('div null');
    var nameofbutton = "newbutton" + i;
	var newInnerHTML = '\
	<button id = "'
    +nameofbutton+
    '" href="https://bsc.rms-inc.com/CorrespondenceHistory/MercuryLinkIndex?mltakey=X8d572681a4634a6d8b35aba6f2e658db#"\
	class="RMSGridColumnActionButton ToolButtonPrintItem RMSGridPrintButton" title="Print Email">\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>';
    if(divelement.children.length < 3)
    {
        divelement.innerHTML = divelement.innerHTML + newInnerHTML;
       // console.log(divelement.getElementById("newbutton"));
        var button = document.getElementById(nameofbutton);
        button.numClicks = 0;
        button.onclick = newButtonAction;
    }
}

async function newButtonAction(){
    console.log("button clicked");
    var email = null;
    while(email == null && emailTaken == false){
        await sleeper(200);
        email = document.getElementById("dEmail");
        if(email != null)
        {
            emailTaken = true;
            var elementArray = [];
            var parent = document.getElementById('dlgCorrespondenceHistorytabs-1').children[0];
            parent.removeChild(parent.querySelector('fieldset'))
            elementArray.push(parent);
            elementArray.push(email);
            console.log(elementArray);
            printDiv(elementArray);
            emailTaken = false;
        }
    }
}

function printDiv(elements) {
    var w = window.open();
    for(var i = 0; i < elements.length; i++){
        w.document.body.innerHTML = w.document.body.innerHTML + elements[i].innerHTML;
    }
    w.print();
    w.close();
    document.querySelector("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.mercuryDialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-titlebar.ui-widget-header.ui-corner-all.ui-helper-clearfix.ui-draggable-handle > button > span.ui-button-icon-primary.ui-icon.ui-icon-closethick").click();
}
