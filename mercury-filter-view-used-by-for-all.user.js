// ==UserScript==
// @name         Mercury Filters View 'Used by' for All
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0.1
// @description  Load the 'used by' information for all filters automatically. It will still take a long time, but you don't need to manually click on each filter and look for this information, and wait for each lookup to end before going to the next. You can let it run in the background while you do something else.
// @author       Curt Grimes
// @match        *://*/Filter/Index/
// @grant        GM_addStyle
// @run-at document-idle
// @updateURL    https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-filter-view-used-by-for-all.user.js
// @downloadURL  https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-filter-view-used-by-for-all.user.js
// ==/UserScript==

(function() {
    'use strict';

    var checkTableLoadInterval = setInterval(function(){
        if (document.querySelector('#ToolButtonExportGrid')) {
            init();
            clearInterval(checkTableLoadInterval);
        }
    },500);

    function init() {
        // Add the button
        document.querySelector('#ToolButtonExportGrid').insertAdjacentHTML('afterEnd', '<a href="#" onclick="return false;" id="CustomViewUsedByForAll" class="RMSGridButtonContainer " title="View \'Used by\' for all..."><span class="RMSGridButton RMSGridImportGear">View \'Used by\' for all...</span></a>');

        if (window.customIsLoadingUsedByFilters) {
            alert("You're already doing this. To stop it, reload the page and start over.");
        }
        else {
            document.querySelector('#CustomViewUsedByForAll').addEventListener('click', function(){
                $("<div style='padding:20px'>This will take a while. You can let the page run in the background while this happens. Continue?</div>").dialog({
                    modal: true,
                    buttons : {
                        "Yes" : function() {
                            $(this).dialog("close");
                            parseRow(0);
                            window.customIsLoadingUsedByFilters = true;
                        },
                        "No" : function() {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }
    }

    function parseRow(rowNumber) {
        var thisRow = document.querySelectorAll('.glblLabParentRow[rmsfiltertype]:not(.parsedForFilter')[rowNumber];

        if (!thisRow) {
            console.log('row not found');
            return;
        }

        $(thisRow).find('td[colndx="1"]').append('<span class="customUsedByCount customUsedByCountChecking">Checking...</span>');

        fetch(location.origin + '/dlgViewFilterUsedBy/BuildTable', {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                FilterID: thisRow.getAttribute('id'),
                FilterName: thisRow.getAttribute('filtername'),
            }),
        })
        .then(function(response) {
            return response.text();
        })
        .then(function(responseText) {
            $(thisRow).find('td[colndx="1"] .customUsedByCountChecking').remove();

            var usedByTable = $(responseText);
            var countOfUsedBy = usedByTable.find('#dlgViewLinkTargetUsedByTableBody .parentRow').length;

            var usedByLink = $('<a href="javascript:void(0)" class="customUsedByCount customUsedByCount'+ countOfUsedBy +'">Used by '+ (countOfUsedBy == 0 ? 'none' : countOfUsedBy)  +'</a>');
            usedByLink.on('click', function(){
                $(usedByTable).dialog({width: '800px'});
            });

            usedByLink.appendTo($(thisRow).find('td[colndx="1"]'));

            // Check the next row
            parseRow(rowNumber + 1);
        });
    }

    GM_addStyle ( `
        .customUsedByCount {
            display: block;
            background: #aaa;
            padding: 5px;
            margin: 5px 0;
        }
        .customUsedByCount0 {
            background: #cf0;
        }
        .customUsedByCountChecking {
            background: #ddd;
        }
    ` );
})();