// ==UserScript==
// @name         Mercury Run From Template
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  Adds a "Run Template" button to allow running a template directly from the template editing screen. As of Mercury 3.0.9 running a template is only possible from the template list view.
// @author       Curt Grimes
// @match        *://*/FeatureBuilder/EditTemplate/?templateid=*
// @grant        none
// @run-at document-idle
// @updateURL   https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-run-from-template.js
// @downloadURL https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-run-from-template.js
// ==/UserScript==

$(function(){
    var svgRunIcon = '<svg style="height: 90%;margin: -3px 4px 0 0;display: inline-block;vertical-align: middle;" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><path fill="#00B918" class="st0" d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M9,17V7l9,5.1L9,17z"/></svg>';
    var runTemplateButton = $('<a href="javascript:void(0)" class="pagetoolBarButtonContainer"><span class="pagetoolBarButton" style="padding-left:0">'+ svgRunIcon +'Run Template</span></a>');

    runTemplateButton.on('click', function(){
        var linkId = $('#txtLinkIdentifier').val();
        runTemplate({linkId});
    });

    // Insert the new button after the preview button.
    $('#ToolButtonPreview').after(runTemplateButton);

    function runTemplate({linkId}) {
        // Copyright Residential Management Systems (RMS), Raleigh, North Carolina, USA.
        ExecuteMercuryLinkTarget(linkId, 0, '', true, null, { "RunFeatureContext":1 });
    }
});