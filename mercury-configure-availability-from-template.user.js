// ==UserScript==
// @name         Mercury Configure Availability From Template
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  Adds a "Configure Availability" option under the "I want to..." menu on the template editing screen. As of Mercury 3.0.9 configuring availability of a template is only possible from the template list view.
// @author       Curt Grimes
// @match        *://*/FeatureBuilder/EditTemplate/?templateid=*
// @grant        none
// @run-at document-idle
// @updateURL    https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-configure-availability-from-template.user.js
// @downloadURL  https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-configure-availability-from-template.user.js
// ==/UserScript==

$(function(){
    var configureAvailabilityButton = $('<li class="IWantMenuChoice"><a href="#">configure availability</a></li>');

    configureAvailabilityButton.find('a').on('click', function(e){
        startConfigureAvailability({
            templateid: getUrlParameter('templateid'),
            templatename: $('#txtFeatureName').data('OriginalName'),
        });

        setTimeout(hideIWantToMenu, 500);
        window.scrollTo(0, 0); // scroll to top
    });

    // Insert the new button after the "configure template data" button.
    configureAvailabilityButton.insertAfter($('#menuTemplateDefinition').parent('.IWantMenuChoice'));

    function startConfigureAvailability({templateid, templatename}) {
        // Copyright Residential Management Systems (RMS), Raleigh, North Carolina, USA.
        ServerAction(
            "TemplateList",
            "CheckTemplateDeleted",
            {templateid},
            function Success(sReturn) {
                if (sReturn == 'success') {
                    MakeDialog(
                        'dlgConfigureTemplateAvailability',
                        {templateid, templatename},
                        function Success(sResult) {
                            ServerAction(
                                "TemplateList",
                                "SaveTemplateAvailability",
                                {
                                    AvilabilityItems: sResult.AvailabilityList,
                                    AvailabilityDelIDs: sResult.DeleteAvailabilityIDs
                                },
                                function (sResult) {
                                    if (sResult != "") {
                                        alert(sResult);
                                    }
                                },
                                null
                            );
                        },
                        null,
                        function Error(sResult) {
                            alert(sResult);
                        },
                        false
                    );
                }
                else {
                    alert(sReturn);
                }
            },
            null
        );
    }

    function getUrlParameter(name) {
        // Credit: https://davidwalsh.name/query-string-javascript
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
});