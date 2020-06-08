// ==UserScript==
// @name         WME RRC AutoLock
// @namespace    https://github.com/jm6087
// @version      2020.06.08.03
// @description  AutoLocks RRCs to set level instead of rank of editor
// @author       jm6087 (with assistance from Dude495 and TheCre8r)
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var UPDATE_NOTES = `This should autolock RRCs to L4 upon selection of the RRC <br><br>
    Added tab as proof of concept for myself<br>
    Script currently conflicts with WME Tiles Update.  Not allowing unverified RRCs to autolock initially
    This is my first script, hope it works and currently is very basic due to limited knoweledge.  Thanks for Dude495, TheCre8r, and SkiDooGuy for their assistance`
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    function setRRCAutoLock() {
        let SelMan = W.selectionManager;
        let SelModel = SelMan.getSelectedFeatures()[0].model;
        // Create an option variable using the following 2 let statements
        let RRCAutoLockChildNumber = 12
        let RRCAutoLockLabel = "label:nth-child(" + RRCAutoLockChildNumber+ ")"
        if (SelModel.attributes.lockRank == null){
            var RRCAutolockRankplusOne = "AutoLock";
        }else{
            var RRCAutolockRankplusOne = SelModel.attributes.lockRank + 1;
        };
        let RRCAutoLock4 = "#edit-panel > div > div > div > div.tab-content > form > div > div > div > div > div.form-control.lock-level-selector.waze-radio-container >" + RRCAutoLockLabel
        if (SelMan.hasSelectedFeatures() && SelModel.type === 'railroadCrossing' && SelModel.attributes.lockRank != 3){
            document.querySelector(RRCAutoLock4).click();
            console.log(SCRIPT_NAME, "Version #", VERSION, "- Lock level changed from", RRCAutolockRankplusOne);
        }else{
            console.log (SCRIPT_NAME, "Version #", VERSION, "- RRC lock not changed, already at lock level", RRCAutolockRankplusOne);
        }
    }
    function RRCAutoLockTab()
    {
        var $section = $("<div>");
        $section.html([
            '<div>',
            '<h3>Hope to someday add option to choose your own lock level</h3></br>',
            '<h4>Currently the script automatically locks RRC at L4 when the RRC is selected</h4></br>',
            '<div>',
            '<h3>User Info</h3></br>',
            '<p><b>Username: <span id="RRCAutoLockUsername"></span></p></b>',
            '<p><b>Rank: <span id="RRCAutoLockRank"></span></p></b>',
            '<p><b>Total edits: <span id="RRCAutoLockTotalEdits"></span></p></b>',
            '<p><b>Total points: <span id="RRCAutoLockTotalPoints"></span></p></b>',
            '</div>',
            '</div>'
        ].join(' '));

        new WazeWrap.Interface.Tab('RRCAL', $section.html(), RRCAutoLockInitializeSettings);
    }

    function RRCAutoLockInitializeSettings()
    {
        $('#RRCAutoLockUsername').text(W.loginManager.user.userName);
        $('#RRCAutoLockRank').text(W.loginManager.user.rank + 1);
        $('#RRCAutoLockTotalEdits').text(W.loginManager.user.totalEdits);
        $('#RRCAutoLockTotalPoints').text(W.loginManager.user.totalPoints);
        console.log(SCRIPT_NAME, "- Tab Created");
    }
    function bootstrap(tries = 1) {
        if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready ) {
            RRCAutoLockTab()
            WazeWrap.Events.register("selectionchanged", null, setRRCAutoLock);
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES);
            console.log(SCRIPT_NAME, "loaded");
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }
    bootstrap();
})();
