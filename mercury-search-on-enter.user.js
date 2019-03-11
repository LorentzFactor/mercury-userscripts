// ==UserScript==
// @name         Mercury Search on Enter
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  When using search filters above lists in the Mercury interface, allow pressing "enter" to start the search.
// @author       Curt Grimes
// @match        *://*/*
// @grant        none
// @run-at document-idle
// @updateURL    https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-search-on-enter.user.js
// @downloadURL  https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-search-on-enter.user.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelectorAll('.RMSScriptEnabled').length) {
        // We are on a Mercury admin page

        document.querySelectorAll('.CollapsibleRoot').forEach(function(collapsibleRoot) {
            // For each collapsible
            var searchButton = collapsibleRoot.querySelector('.CollapsibleContents > div > #Search, .CollapsibleContents > div > #ShowMeList, .CollapsibleContents > #ShowMeList');

            if (searchButton) {
                // It has a 'show me list'/'search' button. Allow pressing enter in any of its inputs
                // to also fire a click on that 'show me list'/'search' button.

                (collapsibleRoot.querySelectorAll('input') || []).forEach(function(input) {
                    input.addEventListener("keyup", function(event) {
                        if (event.keyCode === 13) { // enter
                            event.preventDefault();
                            searchButton.click();
                        }
                    });
                });

                // Autofocus the first one
                collapsibleRoot.querySelector('input, select').focus();
            }
        });
    }
})();