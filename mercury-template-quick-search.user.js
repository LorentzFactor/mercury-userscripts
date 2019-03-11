// ==UserScript==
// @name         Mercury Template Quick Search
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  Adds a search-as-you-type box to the Mercury template list.
// @author       Curt Grimes
// @match        *://*/TemplateList/Index/
// @grant        GM_addStyle
// @run-at document-idle
// @updateURL    https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-quick-search.user.js
// @downloadURL  https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-quick-search.user.js
// ==/UserScript==

$(function(){
    var quickSearchInput = $('<input type="text" style="float: left;margin-right: 7px;width: 200px;padding:2px" autofocus placeholder="Quick search..." />');
    quickSearchInput.insertBefore('#DisplayOptionsHeading');

    // When the input changes, search for templates with that name.
    quickSearchInput.on('change input', function() {
        quickSearchTemplates($(this).val());
    });

    // Select all the text in the input on focus
    quickSearchInput.on('focus', function() {
        $(this).select();
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape" && quickSearchInput.is(":focus")) {
            quickSearchInput.val('').trigger('change');
        }
    });

    // Unfortunately, HookUpListBehaviors() is needed to initialize the "I want to..." lists, and the function
    // is inside an anonymous function on the page, not a member of window that we can call from anywhere.
    // Parse the script tags present on the page at the moment to find the function, and eval() it to make it a member of window.
    // Alternatively, I could copy and paste the entire function defininition here, but I'm not crazy about copying
    // large swaths of Mercury code here. A few other functions are also required to make the "I want to..." menu
    // fully functional.
    makeMercuryFunctionGlobal('HookUpListBehaviors');
    makeMercuryFunctionGlobal('ExportTemplateHelper');
    makeMercuryFunctionGlobal('DeleteTemplate');
    makeMercuryFunctionGlobal('ManageLTLMSecurables');
    makeMercuryFunctionGlobal('RefreshList');

    function quickSearchTemplates(query) {
        if (query) {
            // Hide all the standard Mercury rows
            $('#divTemplateList .glblLabParentRow:not(.quickSearchTemplateRow), #TemplateTable tfoot').hide();

            if (!$('.quickSearchTemplateRow').length && !$('.quickSearchLoadingRow').length) {
                // The quick search template rows haven't finished loading yet.
                // Show loading spinner
                $('#TemplateTable tbody').append('<tr class="quickSearchLoadingRow"><td colspan="99"><div id="customSpinnerPlaceholder"></div></td></tr>');
                SetHtmlToSpinner(true, "#customSpinnerPlaceholder");
            }

            $('#divTemplateList .glblLabParentRow.quickSearchTemplateRow').each(function(){ // for each template in the list
                var templateRowText = $(this).find('.pageTableCell:not(:last-child)').text(); // excludes the last column with the "I want to..." menu
                if (templateRowText.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    // Row contains the query
                    $(this).addClass('quickSearchTemplateRowShown').show();
                }
                else {
                    // Row does not contain the query
                    $(this).removeClass('quickSearchTemplateRowShown').hide();
                }
            });

            // Highlight matches in shown rows
            $('.highlightQuickSearchMatch').removeClass('highlightQuickSearchMatch'); // undo any previous highlights
            $('.quickSearchTemplateRowShown').each(function(){
               $(this).find('.pageTableCell:not(:last-child)').each(function(){ // excludes the last column with the "I want to..." menu
                   var matchIndex = ($(this).text() || '').toLowerCase().indexOf(query);
                   if (matchIndex !== -1) {
                       // This table cell has the match
                       var cellText = $(this).text();
                       $(this).html(
                           cellText.substring(0, matchIndex) // text before match
                           + '<span class="highlightQuickSearchMatch">'+ cellText.substring(matchIndex, matchIndex + query.length)  +'</span>'
                           + cellText.substring(matchIndex + query.length) // text after match
                       );
                   }
               });

            });
        }
        else {
            // No query

            // Show all the standard Mercury rows
            $('#divTemplateList .glblLabParentRow:not(.quickSearchTemplateRow), #TemplateTable tfoot').show();

            // Hide all the rows we use during quick search
            $('#divTemplateList .glblLabParentRow.quickSearchTemplateRow, #divTemplateList .quickSearchLoadingRow').hide();
        }

        HookUpListBehaviors();
    }



    // Build a list of all the templates
    var fullTemplateListHTML = '';
    function cursorThroughTableByPage(pageNumber) {
        getTemplateListHTML(pageNumber)
            .then(function(resultHTML) {
                var templateRows = $(resultHTML).find('.glblLabParentRow');
                var maxPageSize = $('select.ddlbAvailablePageSizes option:selected').val();
                fullTemplateListHTML += templateRows.wrapAll("<div/>").parent().html();

                if (templateRows.length >= maxPageSize) {
                    cursorThroughTableByPage(pageNumber + 1);
                }
                else {
                    // No more pages
                    var fullTemplateList = $(fullTemplateListHTML);
                    fullTemplateList.each(function() {
                        $(this)
                            .addClass('quickSearchTemplateRow')
                            .css('backgroundColor', '') // style attribute was being used to style alternate rows. CSS should be doing this instead.
                            .hide();
                    });
                    fullTemplateList.appendTo('#divTemplateList tbody');


                    // If a query is already waiting, filter the list
                    $('.quickSearchLoadingRow').remove();
                    if (quickSearchInput.val()) {
                        quickSearchTemplates(quickSearchInput.val());
                    }
                }
        });
    }

    cursorThroughTableByPage(0);

    function getTemplateListHTML(pageNumber) {
        return new Promise(function(resolve, reject) {
            // Copyright Residential Management Systems (RMS), Raleigh, North Carolina, USA.
            var gridProperties = GetRMSGridSettings('divTemplateList');
            gridProperties.pageNumber = pageNumber;
            ServerAction("TemplateList", "RefreshList", {
                gridProperties: JSON.stringify(gridProperties),
                createdBy: $('#ddSearchCreatedBy option:selected').val(),
                modifiedBy: $('#ddSearchModifiedBy option:selected').val(),
                templateName: $('#txtSearchTemplateName').val(),
                linkID: $('#txtSearchLinkID').val(),
                sFromDate: GetDateTimePickerValue($('#SearchFromDateTime')),
                sToDate: GetDateTimePickerValue($('#SearchToDateTime')),
                Group1ID: parseInt($('#ddSearchGroup1 option:selected').val()),
                Group2ID: parseInt($('#ddSearchGroup2 option:selected').val()),
                ActiveOnly: $("#chkSearchActiveOnly").prop("checked"),
                sConditionList:  JSON.stringify(GetConditionEngineSetListJSON('TemplateIndexSearchCEPicker')),
                IDtoTop: 0,
            }, function Success(resultHTML) {
                resolve(resultHTML);
            });
        });
    }


    function makeMercuryFunctionGlobal(functionName) {
        var scriptTagContents = $('#ContentAreaWrapperBody script').text();

        var functionStartString = 'function '+ functionName;
        var functionStartIndex = scriptTagContents.indexOf(functionStartString);
        var openingBraceIndex = scriptTagContents.indexOf('{', functionStartIndex + functionStartString.length);
        var closingBraceIndex = findClosingBracketMatchIndex(scriptTagContents, openingBraceIndex);
        var functionAsString = scriptTagContents.substring(functionStartIndex, closingBraceIndex + 1);

        eval.call(window, functionAsString); // makes the function a member of window
    }

    // https://codereview.stackexchange.com/a/179484/59660
    function findClosingBracketMatchIndex(str, pos) {
        if (str[pos] != '{') {
            throw new Error("No '{' at index " + pos);
        }
        let depth = 1;
        for (let i = pos + 1; i < str.length; i++) {
            switch (str[i]) {
                case '{':
                    depth++;
                    break;
                case '}':
                    if (--depth == 0) {
                        return i;
                    }
                    break;
            }
        }
        return -1;    // No matching closing parenthesis
    }

    GM_addStyle ( `
        .quickSearchTemplateRowShown {
            /* Can't add back zebra rows in CSS without getting the hidden rows out of here. Easiest solution is to avoid
            zebra rows for now. */
            background: linear-gradient(#fff,#f5f5f5);
        }

        /* Undo inline style margin top on spinners */
        .quickSearchLoadingRow #customSpinnerPlaceholder > div {
            margin-top:0 !important;
        }

        .highlightQuickSearchMatch {
            background: rgba(255, 217, 0, .7);
            margin: -1px -2px;
            padding: 1px 2px;
            border-radius: 3px;
            box-shadow: 0 1px 0 1px rgba(202, 171, 0, .7);
        }
    ` );
});