// ==UserScript==
// @name         Extended Search on Enter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Works for pop-up windows as well
// @author       You
// @match        *://*/*
// @grant        none
// @run-at document-idle
// @update 	https://github.com/LorentzFactor/mercury-userscripts/raw/master/mercury-search-on-enter.user.js
// @download 	https://github.com/LorentzFactor/mercury-userscripts/raw/master/mercury-search-on-enter.user.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("rms-inc.com")) {
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
