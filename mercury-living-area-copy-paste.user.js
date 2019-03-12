// ==UserScript==
// @name         Mercury Living Area Copy/Paste
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  Adds tools for copying/pasting traced living area regions. Useful if you have buildings with multiple floors that have identical layouts. You can avoid having to trace multiple floors over again.
// @author       Curt Grimes
// @match        *://*/LivingAreas/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-living-area-copy-paste.user.js
// @downloadURL  https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-living-area-copy-paste.user.js
// ==/UserScript==

$(function(){

    setInterval(function() {
        if ($('#ELAMImageMapEditDiv').length && !$('#livingAreaCopyPasteButtons').length) {
            // Add the buttons
            $('#ELAMImageMapEditDiv').before('<div id="livingAreaCopyPasteButtons" style="margin:10px 0"></div>');

            $('<button>Copy</button>').button().on('click', startCopyLivingArea).appendTo('#livingAreaCopyPasteButtons');
            $('<span>&nbsp;</span>').appendTo('#ELAMMappingTableDiv');
            $('<button>Paste</button>').button().on('click', startPasteLivingArea).appendTo('#livingAreaCopyPasteButtons');
        }
    },500);

    function startCopyLivingArea() {
        if (typeof(Storage) === void(0)) {
            alert("Local storage is not supported. Try a more modern browser.");
        }
        else if (!userHasSelectedLivingArea()) {
            alert("First, go to Living Areas in Mercury and select a living area. When viewing a living area, click this button again to copy it.");
        }
        else {
            // Get values
            var livingAreaName = $('.RMSTreeFolderText.RMSTreeFolderSelected').text();

            var $livingAreasTable = $($('<div/>').append($('#ELAMTable').clone()).html());

            // Sort by room name alphabetically
            $livingAreasTable.children('tr').sort(function (a, b) {
                var contentA = $(a).find('.dlgScrollTableCell:eq(1)').html();
                var contentB = $(b).find('.dlgScrollTableCell:eq(1)').html();
                return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            })

            var storageKey = JSON.stringify({"niuSavedLivingAreaMap":livingAreaName});
            var storageValue = JSON.stringify($livingAreasTable.html());

            if (localStorage.getItem(storageKey) && !confirm(livingAreaName+" is already saved to the clipboard. Overwrite?")) {
                alert("Not saved");
            }
            else {
                localStorage.setItem(storageKey, storageValue);
                alert("Saved "+livingAreaName);
            }
        }

        function userHasSelectedLivingArea() {
            return $('.RMSTreeFolderText.RMSTreeFolderSelected').length && $('#ContentAreaWrapperTitle').text() === "Living Areas";
        }
    }

    function startPasteLivingArea() {
        if (!document.getElementById('RMSHeaderLogo')) {
            // Not viewing RMS
            alert("First, go to Living Area Maps in Mercury and select a living area. When viewing a living area, click this button again to view a list of copied regions that you can paste.");
        }
        else {
            // add some CSS that we may need later
            $('body').append('<style type="text/css">.niuTemporaryMapRegion{stroke:red;fill:red;fill-opacity:.3;animation:niu-region-flash .7s infinite;-moz-animation:niu-region-flash .7s infinite;-webkit-animation:niu-region-flash .7s infinite;-o-animation:niu-region-flash .7s infinite}@keyframes niu-region-flash{50%{stroke:orange;fill:orange}}@-moz-keyframes niu-region-flash{50%{stroke:orange;fill:orange}}@-webkit-keyframes niu-region-flash{50%{stroke:orange;fill:orange}}</style>');


            var savedAreaNames = getNIUSavedLivingAreaNames();
            var $dialog = $('<ul />');
            for (var i = 0; i < savedAreaNames.length; i++) {
                $dialog.append('<li style="margin:0 0 10px 20px">'+ savedAreaNames[i] +' <a class="applySavedAreaButton" data-key="'+ savedAreaNames[i] +'" href="#">Apply Saved Regions</a> <a class="deleteSavedAreaButton" data-key="'+ savedAreaNames[i] +'" href="#">Delete</a></li>');
            }
            if (!savedAreaNames.length) {
                $dialog.html("No areas saved");
            }

            $dialog.dialog({
                title: "Living Areas Clipboard",
                width: 800,
                modal: true
            });

            $('.applySavedAreaButton,.deleteSavedAreaButton').button();

            $('.deleteSavedAreaButton').on('click', function(){
                if (confirm("Delete "+ $(this).attr('data-key') +"?")) {
                    localStorage.removeItem(JSON.stringify({"niuSavedLivingAreaMap":$(this).attr('data-key')}));
                    $(this).parent('li').remove();
                }
                return false;
            });

            $('.applySavedAreaButton').on('click', function(){
                applySavedLivingAreaRegionsToCurrentView(JSON.stringify({"niuSavedLivingAreaMap":$(this).attr('data-key')}));
                return false;
            });
        }

        function getNIUSavedLivingAreaNames() {
            var savedLivingAreaNames = [];
            for (var i = 0; i < localStorage.length; i++) {
                try {
                    if ('niuSavedLivingAreaMap' in JSON.parse(localStorage.key(i))) {
                        // This stored item is an niuSavedLivingAreaMap. Put it in list
                        savedLivingAreaNames.push(JSON.parse(localStorage.key(i)).niuSavedLivingAreaMap);
                    }
                } catch(e){}
            }
            return savedLivingAreaNames;
        }

        function applySavedLivingAreaRegionsToCurrentView(storageKey) {
            if (!userHasSelectedLivingArea()) {
                alert("Please go to Living Area Maps in Mercury and select a living area to continue.");
                $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs
                return false;
            }
            else if (!userHasSelectedImage()) {
                alert ("You must select an image for this area before copying your traced regions to it.");
                $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs
                return false;
            }
            else if ($('#ELAMImageMapOverlayDiv svg').children().length > 0 && !confirm("This area already has some regions drawn on it. Are you sure you want to continue?")) {
                // There's already regions drawn and the user didn't want to continue
                $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs
                return false;
            }
            else {
                disableNativeMercuryControls();

                var livingAreasTable = JSON.parse(localStorage.getItem(storageKey));

                $('#niuUnparsedLivingAreasToApply').remove(); // if it exists
                $('<div id="niuUnparsedLivingAreasToApply" />').append(livingAreasTable).hide().appendTo('body');
                $('#niuUnparsedLivingAreasToApply table').attr('id',''); // remove ID from cloned table

                $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs

                applySingleUnparsedRegion();
            }
        }

        function applySingleUnparsedRegion() {
            if (!$('#niuUnparsedLivingAreasToApply .ELAMParentRow').length) {
                // no more regions to apply
                $('#niuUnparsedLivingAreasToApply').remove(); // remove all temporarily saved regions
                $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs

                $('<div>All regions have been applied. Save changes?</div>').dialog({
                    modal: true,
                    buttons: [
                        {
                            text: "Not Now",
                            click: function(){
                                $(this).dialog('destroy').remove();
                            }
                        },
                        {
                            text: "Save Changes",
                            click: function(){
                                $('#ToolButtonSaveChanges').click();
                                $(this).dialog('destroy').remove();
                            }
                        }
                    ]
                });
                enableNativeMercuryControls();
                return false;
            }
            var $finalLivingAreaTable = $('#ELAMTable tbody').first();
            var $livingAreaRowToApply = $('#niuUnparsedLivingAreasToApply .ELAMParentRow').first();
            // Cells (identified by dlgScrollTableCell class) appear to be identified by order, not explicitly
            // index 0: UI controls
            // 1: Room number or bed space
            // 2: Coordinates
            // 3: "Room" or "Bed_Space"
            // 4: Room number or bed space
            // 5: "Room Number" or "Bed Space"
            // 6: Room number or bed space AGAIN
            // Example:
            // 	<tr class="ELAMParentRow">
            //		<td class="dlgScrollTableCell" align="center" style="width:80px;">
            //			<img style="padding-right:4px;" class="ELAMDlt" alt="Remove Map of Living Area" title="Remove Map of Living Area" src="/Content/Styles/RMS/images/delete.png">
            //			<img style="" class="ELAMMap" alt="Add-Edit Map of Living Area" title="Add-Edit Map of Living Area" src="/content/styles/rms/images/map-edit-icon16.png">
            //			<img style="padding-left:4px; " class="ELAMShowMap" alt="Highlight Map of Living Area" title="Highlight Map of Living Area" src="/content/styles/rms/images/map-locate-icon16.png">
            //			<img style="padding-left:4px; display:none;" class="ELAMTransparent" alt="" title="" src="/content/styles/rms/images/transp16.png">
            //		</td>
            //		<td class="dlgScrollTableCell" style="width:0px; display:none;">NPE-0102</td>
            //		<td class="dlgScrollTableCell" style="width:0px; display:none;">438,280;478,280;478,313;437,313</td>
            // 		<td class="dlgScrollTableCell" style="width:0px; display:none;">Room</td>
            // 		<td class="dlgScrollTableCell" style="width:0px; display:none;">NPE-0102</td>
            // 		<td class="dlgScrollTableCell" style="width:150px;">Room Number</td>
            // 		<td class="dlgScrollTableCell" style="width:200px;">NPE-0102</td>
            // </tr>

            var roomNumber = $livingAreaRowToApply.find('.dlgScrollTableCell:eq(1)').html();
            var coordinates = $livingAreaRowToApply.find('.dlgScrollTableCell:eq(2)').html().replace(/;/g, " "); // polygon element wants spaces, not semicolons between coordinates

            var dialogTitle = "";

            if (livingAreaRowRepresentsBedSpace($livingAreaRowToApply)) {
                // Change selection at top to Bed Space (value 8)
                // so we can get its options
                $('select.ELAMAddLevel').val(8).change();

                // apply preview poly to the map
                // currently coordinates is a string that looks like "458,289"
                var coordinatesArray = coordinates.split(','); // split into X and Y


                // Add flashing rectangle that will be behind image
                var coordinateTopLeft = parseInt(parseInt(coordinatesArray[0])-12) +','+ parseInt(parseInt(coordinatesArray[1])-12);
                var coordinateTopRight = parseInt(parseInt(coordinatesArray[0])+12) +','+ parseInt(parseInt(coordinatesArray[1])-12);
                var coordinateBottomLeft = parseInt(parseInt(coordinatesArray[0])-12) +','+ parseInt(parseInt(coordinatesArray[1])+12);
                var coordinateBottomRight = parseInt(parseInt(coordinatesArray[0])+12) +','+ parseInt(parseInt(coordinatesArray[1])+12);
                $('#ELAMImageMapOverlayDiv svg').append('<polygon points="'+ coordinateTopLeft +' '+ coordinateTopRight +' '+ coordinateBottomRight +' '+ coordinateBottomLeft +'" class="niuTemporaryMapRegion niuTemporaryBedSpaceBackground" fill="blue" fill-opacity="0" stroke="blue" stroke-width="4"></polygon>');

                // Add image
                var coordinateX = coordinatesArray[0] - 12; // Mercury does -12 to offset the icon so it appears centered
                var coordinateY = coordinatesArray[1] - 12; // Mercury does -12 to offset the icon so it appears centered
                var img = document.createElementNS('http://www.w3.org/2000/svg','image');
                img.setAttributeNS(null,'height','24');
                img.setAttributeNS(null,'width','24');
                img.setAttributeNS('http://www.w3.org/1999/xlink','href','/Content/Styles/RMS/images/bed24.png');
                img.setAttributeNS(null,'x',coordinateX);
                img.setAttributeNS(null,'y',coordinateY);
                img.setAttributeNS(null, 'visibility', 'visible');
                img.setAttributeNS(null, 'class', 'niuTemporaryMapRegion');
                $('#ELAMImageMapOverlayDiv svg').append(img);

                $('#ELAMImageMapOverlayDiv').html($('#ELAMImageMapOverlayDiv').html()); // "refresh" the SVG element contained in this div so our new polygon appears

                dialogTitle = "Choose a bed space for this region";
            }
            else {
                // Change selection at top so we can get its options
                if (livingAreaRowRepresentsCommunity($livingAreaRowToApply)) {
                    // Community = option 2
                    $('select.ELAMAddLevel').val(2).change();
                }
                else if (livingAreaRowRepresentsBuilding($livingAreaRowToApply)) {
                    // Building = option 3
                    $('select.ELAMAddLevel').val(3).change();
                }
                else if (livingAreaRowRepresentsFloor($livingAreaRowToApply)) {
                    // Floor = option 4
                    $('select.ELAMAddLevel').val(4).change();
                }
                else if (livingAreaRowRepresentsFloorSection($livingAreaRowToApply)) {
                    // FloorSection = option 5
                    $('select.ELAMAddLevel').val(5).change();
                }
                else if (livingAreaRowRepresentsSuite($livingAreaRowToApply)) {
                    // Suite = option 6
                    $('select.ELAMAddLevel').val(6).change();
                }
                else if (livingAreaRowRepresentsRoom($livingAreaRowToApply)) {
                    // Room = option 7
                    $('select.ELAMAddLevel').val(7).change();
                }
                else {
                    // Unsupported region type. Skip it.
                    var regionType = $livingAreaRowToApply.find('.dlgScrollTableCell:eq(5)').html();
                    alert("Unable to copy the next region. Skipping "+ regionType +".");
                    continueToNextUnparsedRegion();
                }


                // apply preview poly to the map
                $('#ELAMImageMapOverlayDiv svg').append('<polygon points="'+ coordinates +'" class="niuTemporaryMapRegion" fill="blue" fill-opacity="0" stroke="blue" stroke-width="4"></polygon>');
                $('#ELAMImageMapOverlayDiv').html($('#ELAMImageMapOverlayDiv').html()); // "refresh" the SVG element contained in this div so our new polygon appears

                dialogTitle = "Choose a name for this region";
            }

            // Scroll to the highlighted region
            $('html,body').stop( true, true ).animate({ scrollTop: $('.niuTemporaryMapRegion').offset().top - 100 }, 'fast');

            var $roomNumberSelect = $('<div id="niuTempRoomNumberSelect" />').append($('select.ELAMAddItem').first().clone().prop('disabled',false));

            $('#niuTempDialogBtnApply, #niuTempDialogBtnSkip, #niuTempDialogBtnCancel').off();

            $('<div><div id="niuTempRoomNumberSelect">'+ $roomNumberSelect.html() +'</div></div>')
                .dialog({
                title : dialogTitle,
                width : 400,
                position : { // position dialog directly to right of floorplan/map
                    my : "left",
                    at : "right",
                    of : $('#ELAMImageMapOverlayDiv')
                },
                buttons: [
                    {
                        text: "Apply [A]",
                        id: "niuTempDialogBtnApply",
                        click: function() {
                            // Set to new room number
                            $livingAreaRowToApply.find('.dlgScrollTableCell:eq(1), .dlgScrollTableCell:eq(4), .dlgScrollTableCell:eq(6)')
                                .html($('#niuTempRoomNumberSelect select').val());
                            $('select.ELAMAddItem').first().find('option[value="'+ $('#niuTempRoomNumberSelect select').val() +'"]')
                                .remove(); // remove option from select list
                            $livingAreaRowToApply.clone().appendTo($finalLivingAreaTable);
                            $livingAreaRowToApply.remove();
                            $('.niuTemporaryBedSpaceBackground').remove(); // temporary region overlay
                            continueToNextUnparsedRegion();
                        }
                    },
                    {
                        text: "Skip [K]",
                        id: "niuTempDialogBtnSkip",
                        click: function() {
                            $livingAreaRowToApply.remove(); // from temporary div
                            $('.niuTemporaryMapRegion, .niuTemporaryBedSpaceBackground').remove(); // temporary region overlay
                            continueToNextUnparsedRegion();
                        }
                    },
                    {
                        text: "Stop [C]",
                        id: "niuTempDialogBtnCancel",
                        click: function() {
                            $('#niuUnparsedLivingAreasToApply').remove(); // remove all temporarily saved regions
                            $('.niuTemporaryMapRegion, .niuTemporaryBedSpaceBackground').remove(); // temporary region overlay
                            $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs
                        }
                    }
                ],
                open: function(event, ui) {
                    $("input").blur();
                    $(document)
                        .off('keydown') // this might unbind things other than niuTempRoomNumberSelectKeyboardEventHandler, but only unbinding niuTempRoomNumberSelectKeyboardEventHandler wasn't working for me
                        .on('keydown', niuTempRoomNumberSelectKeyboardEventHandler);
                }
            });

            // Position dialog height
            $('.ui-dialog').css({
                "top" : $('.niuTemporaryMapRegion').offset().top - 70
            });

        }

        var niuTempRoomNumberSelectKeyboardEventHandler = function (e){
            console.log("Keydown!");
            if (e.keyCode == 65) { // a
                $('#niuTempDialogBtnApply').click();
            }
            else if (e.keyCode == 75) { // k
                $('#niuTempDialogBtnSkip').click();
            }
            else if (e.keyCode == 67) { // c
                $('#niuTempDialogBtnCancel').click();
            }
        };

        function livingAreaRowRepresentsCommunity($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Community";
        }

        function livingAreaRowRepresentsBuilding($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Building";
        }

        function livingAreaRowRepresentsFloor($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Floor";
        }

        function livingAreaRowRepresentsFloorSection($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "FloorSection";
        }

        function livingAreaRowRepresentsSuite($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Suite";
        }

        function livingAreaRowRepresentsRoom($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Room";
        }

        function livingAreaRowRepresentsBedSpace($row) {
            return $row.find('.dlgScrollTableCell:eq(3)').html() == "Bed_Space";
        }

        function continueToNextUnparsedRegion() {
            $(".ui-dialog-content").dialog("destroy").remove(); // close all open dialogs
            $('.niuTemporaryMapRegion').attr('class',''); // unhighlight the last temporary region (can't use removeClass() because this is SVG)
            $('#niuTempRoomNumberSelect').remove();
            applySingleUnparsedRegion();
        }

        function userHasSelectedLivingArea() {
            return $('.RMSTreeFolderText.RMSTreeFolderSelected').length && $('#ContentAreaWrapperTitle').text() === "Living Areas";
        }

        function userHasSelectedImage() {
            return $('#ELAMImagePickerDiv input').val() != "";
        }

        function disableNativeMercuryControls() {
            $('.ELAMAddLevel, .ELAMAddItem, .RMSFilePicker input').prop('disabled', true);
            $('.ELAMAdd').hide();
        }

        function enableNativeMercuryControls() {
            $('.ELAMAddLevel, .ELAMAddItem, .RMSFilePicker input').prop('disabled', false);
            $('.ELAMAdd').show();
        }
    }

});