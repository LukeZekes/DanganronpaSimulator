"use strict";
let motives = ["the blackened will get to meet anyone they want.", "the blackened will get $" + (Math.floor(Math.random() * 10) * 10 + 10) + " million.",
    "the blackened will get to see their family again."];
let usedMotives = [];
let main = document.getElementById('main');
let setting = JSON.parse(sessionStorage.getItem('setting'));
let livingCharacters = JSON.parse(sessionStorage.getItem('currentCharacters'));
let headmaster = JSON.parse(sessionStorage.getItem('headmaster'));
let protagonist = JSON.parse(sessionStorage.getItem('protagonist'));
let support = JSON.parse(sessionStorage.getItem('support'));
let antagonist = JSON.parse(sessionStorage.getItem('antagonist'));
let mastermind = JSON.parse(sessionStorage.getItem('mastermind'));
let availableAreas = setting.areas[0];
let availableFTEvents = JSON.parse(sessionStorage.getItem('availableFTEvents'));
let bodyDescriptions = [
    "There was a knife wound in their chest.",
    "They had multiple slash wounds on their body.",
    "They had duct tape covering their mouth.",
    "They had multiple bruises all over them.",
    "There was a large bruise on their head."
]
let crimeSceneDescriptions = [

]
let dailyCharacters; //Reperesents the characters which have already participated in a free time event (FTEvent) on a given day
let dailyEvents; //Represents the FTEvents that have already taken place on a given day
let dailyAreas;
let openEventTag = "<p class=\"dayEvent\">"; //A day event is anything that happens during a day
let closeEventTag = "</p>";
let day = 1;
let dayElement = document.getElementById("day");

let numMurder = 0;
let victim1, victim2, culprit;
function randomFromArray(arr) { //I have to type this out so much that I made it a function, simply picks a random element from an array
    return arr[Math.floor(Math.random() * arr.length)];
}
function addTextToMain(_text) {
    //Takes a string passed in _text, adds opening and closing HTML tags, and adds it to main.innerHTML
    main.innerHTML += openEventTag + _text + closeEventTag;
}
function checkFTEvent(_e) { //The AND operator was behaving weird for some reason so this is my work around to see if:
    //1) There are enough characters who are alive and have not already participated in a FTEvent that day
    //2) The event has not been already done that day
    //3) The area of the event has not yet been used today
    /*if (dailyEvents.indexOf(_e) == -1) {
        if (livingCharacters.length >= (_e.numCharacters + dailyCharacters.length)) {
            if (_e.area == "any") {
                return true;
            }
            else if (!dailyAreas.includes(_e.area)) {
                return true;
            }

        }
    }*/
    if (livingCharacters.length >= (_e.numCharacters + dailyCharacters.length)) {
        if (dailyEvents.indexOf(_e) == -1) {
            if (_e.area == "any")
                return true;
            else if (_e.area == "ULAB")
                return true;
            else if (dailyAreas.indexOf(_e.area) == -1)
                return true;
        }
    }
    return false;
    //This is stupid I hate javascript
}
function doFTEvent() {
    //#region Checks
    if (dailyCharacters.length > livingCharacters.length) {
        console.error("Could not do new free time event, dailyCharacters.length > livingCharacters.length (how????)")
        return;
    }
    else if (dailyCharacters.length == livingCharacters.length) {
        console.error("Could not do new free time event, dailyCharacters.length = livingCharacters.length (all living characters have already done a FTEvent today)");
        return;
    }
    else if (dailyEvents.length > availableFTEvents.length) {
        console.error("Could not do new free time event, dailyEvents.length > availableFTEvents.length (how????)");
        return;
    }
    else if (dailyEvents.length == availableFTEvents.length) {
        console.error("Could not do new free time event, dailyEvents.length = availableFTEvents.length (All available FTEvents have been done today)");
        return;
    }
    //#endregion
    else {
        let e;
        let _text;
        let _character;
        let startingIndex = 1;
        do {
            //Pick an event
            e = availableFTEvents[Math.floor(Math.random() * availableFTEvents.length)]
        } while (!checkFTEvent(e));
        _text = e.text;
        if (e.area == "ULAB") {
            startingIndex = 2;
            do {
                _character = randomFromArray(livingCharacters);
            } while (dailyCharacters.includes(_character)); //Make sure the chosen character has not been in a FTEvent already today
            //Check if the Ultimate Lab belonging to _character is available
            let _lab = "the Ultimate " + _character.talent + " Lab"; //The string representing the lab belonging to _character
            if (availableAreas.indexOf(_lab) != -1) {
                //If it is available, make sure _character and their lab are not chosen again that day + replace C1 with _character.name + insert location if necessary
                dailyCharacters.push(_character);
                dailyAreas.push(_lab);
                while (_text.indexOf("C1") != -1) {
                    _text = _text.replace("C1", _character.name);
                }
                //Replace all "[ULAB]" in text with _lab
                while (_text.indexOf("[ULAB]") != -1) {
                    _text = _text.replace("[ULAB]", _lab);
                }
            }
            //If not, simply return without doing anything.
            else {
                console.warn("Tried to use Ultimate Lab for " + _character.name + " but it was not available.")
                return;
            }
        }
        else {
            if (e.area != "any") {
                dailyAreas.push(e.area);
            }
        }
        //Repeat for the number of characters in the FTEvent (given by e.numCharacters)
        for (let i = startingIndex; i <= e.numCharacters; i++) {
            //Choose a character
            do {
                _character = randomFromArray(livingCharacters);
            } while (dailyCharacters.includes(_character)); //Make sure the chosen character has not been in a FTEvent already today
            //Make sure the chosen character will not be chosen again that day
            dailyCharacters.push(_character);
            //Replace appropriate section in the event text w/ character name
            while (_text.includes("C" + i)) {
                _text = _text.replace("C" + i, _character.name);
            }
        }
        //Check for C# (that is, C followed by a digit) in the text again, for ones that contain text about multiple characters but don't require all of them to be present
        //For example: 'C1 writes a letter to C2' should still leave C2 available for more events
        while (_text.search(/C\d/gm) != -1) {
            //console.log("Replacing without adding to dailyCharacters: " + _text);
            //Find C# text and get # from text
            let x = _text.charAt(_text.search(/C\d/gm) + 1);
            //Pick character
            do {
                _character = livingCharacters[Math.floor(Math.random() * livingCharacters.length)];
            } while (_text.indexOf(_character.name) != -1);
            //Replace all C# with the character
            do {
                _text = _text.replace("C" + x, _character.name);
            } while (_text.indexOf("C" + x) != -1);
        }

        //Check to see if text has section for randomly generated area
        if (_text.indexOf("[location]") != -1) {
            //If so, pick an area randomly and replace that section in the text with that area
            let _area = randomFromArray(availableAreas);
            while (dailyAreas.includes(_area)) {
                _area = randomFromArray(availableAreas);
            }
            dailyAreas.push(_area);
            //Replace all "[location]" in text with _area
            while (_text.includes("[location]")) {
                _text = _text.replace("[location]", _area);
            }
            //  console.log(_area);
        }
        //Replace [headmaster] with headmaster's name
        while (_text.indexOf("[headmaster]") != -1) {
            _text = _text.replace("[headmaster]", headmaster);
        }
        //Make sure the chosen event will not be chosen again that day
        dailyEvents.push(e);
        //Add text to document w/ event
        addTextToMain(_text);
        //console.log(dailyEvents);
    }
}
function updateAvailableFTEvents() {
    //Checks setting.FTEvents for FTEvents whose area is available and is not already in availableFTEvents, and adds those to availableFTEvents
    let temp = [];
    let events = setting.FTEvents;
    for (let i = 0; i < events.length; i++) {
        let e = events[i];
        if ((availableFTEvents.indexOf(e) == -1) && ((e.area == "any") || (availableAreas.indexOf(e.area) != -1)) || (e.area == "ULAB")) {
            temp.push(e);
            //console.log("Updated availableFTEvents: " + e.text);
        }
    }
    availableFTEvents = availableFTEvents.concat(temp);
    sessionStorage.setItem("availableFTEvents", JSON.stringify(availableFTEvents));
    //console.log(availableFTEvents);
}
function doMotive() {
    let _motive;
    //Pick a motive that has not already been used this simulation
    do {
        _motive = motives[Math.floor(Math.random() * motives.length)];
    } while (usedMotives.indexOf(_motive) != -1);
    //Add the chosen motive to usedMotives so it won't be used again
    usedMotives.push(_motive);
    addTextToMain(headmaster + " called everyone to " + setting.startingArea + " for an important announcement.");
    addTextToMain("They announced a new motive to spice up the killing game: <span class='motive'>" + _motive + "</span>");
}
function doMurder() {
    numMurder++;
    let tempIndex;
    do {
        tempIndex = Math.floor(Math.random() * livingCharacters.length);
        //Pick victim
        victim1 = livingCharacters[tempIndex];

    } while (victim1.name == protagonist.name); //Protagonist cannot be victim

    livingCharacters.splice(tempIndex, 1)
    //Pick culprit (can't be victim because they were removed from livingCharacters)
    do {
        culprit = randomFromArray(livingCharacters);

    } while (culprit.name == protagonist.name); //Protagonist cannot be culprit

    // console.log("Victim: " + victim1.name + "\nCulprit: " + culprit.name);
    //How many people find the body and where
    let _location = availableAreas[Math.floor(Math.random() * availableAreas.length)];
    let num = Math.floor(Math.random() * 3) + 1; //Between 1 and 3 people will find the body
    let r = Math.random() > 0.5;
    let char1 = randomFromArray(livingCharacters).name;
    let char2, char3;
    switch (num) {
        case 1:
            r ? addTextToMain(`<span class='death'>${char1} found ${victim1.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim1.name}'s body was found in ${_location} by ${char1}!</span>`);
            break;
        case 2:
            do {
                char2 = randomFromArray(livingCharacters).name;
            } while (char2 == char1);
            r ? addTextToMain(`<span class='death'>${char1} and ${char2} found ${victim1.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim1.name}'s body was found in ${_location} by ${char1} and ${char2}!</span>`);
            break;
        case 3:
            do {
                char2 = randomFromArray(livingCharacters).name;
            } while (char2 == char1);
            do {
                char3 = randomFromArray(livingCharacters).name;
            } while (char3 == char1 || char3 == char2);
            r ? addTextToMain(`<span class='death'>${char1}, ${char2} and ${char3} found ${victim1.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim1.name}'s body was found in ${_location} by ${char1}, ${char2} and ${char3}!</span>`);
            break;
    }
}
function doInvestigation() {
    main.innerHTML += "<p class='investigationTime'>-Investigation time!-</p>";
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            addTextToMain(protagonist.name + " decided to investigate " + victim1.name + "'s body:");
            break;
        case 1:
            addTextToMain(protagonist.name + " began investigating " + victim1.name + "'s body:");
            break;
        case 2:
            //Falls through to case 3, then to default if both support and antagonist are dead
            if (support.isAlive) {
                addTextToMain(protagonist.name + " and " + support.name + " decided to investigate " + victim1.name + "'s body:");
                break;
            }
            else if (antagonist.isAlive) {
                addTextToMain(protagonist.name + " and " + antagonist.name + " decided to investigate " + victim1.name + "'s body:");
                break;
            }
        case 3:
            if (support.isAlive) {
                addTextToMain(protagonist.name + " and " + support.name + " took turns investigating " + victim1.name + "'s body:");
                break;
            }
            else if (antagonist.isAlive) {
                addTextToMain(protagonist.name + " and " + support.name + " took turns investigating " + victim1.name + "'s body:");
                break;
            }
        default:
            Math.random() > 0.5 ? addTextToMain(protagonist.name + " decided to investigate " + victim1.name + "'s body:") :
                addTextToMain(protagonist.name + " began investigating " + victim1.name + "'s body:");
    }
    //Protag should investigate the body - pick number of descriptions - pick description of body from list
    let _usedDesc = [];
    let _desc;
    let numDesc = Math.floor(Math.random() * 3) + 2; //Give between 2 and 5 descriptions of the body
    let p = document.createElement('p');
    let ul = document.createElement('ul');
    ul.className = "bodyDesc";
    main.appendChild(p);
    p.appendChild(ul);
    for (let i = 0; i < numDesc; i++) {
        //Pick a description
        do {
            _desc = randomFromArray(bodyDescriptions);
        } while (_usedDesc.indexOf(_desc) != -1);
        //Make sure description is not used again
        _usedDesc.push(_desc);
        //Output description to main.innerHTML
        let _li = document.createElement('li');
        let _p = document.createElement('p');
        _p.appendChild(document.createTextNode(_desc));
        _li.appendChild(_p);
        ul.appendChild(_li);
    }
}
function nextDay() {
    dayElement.innerHTML = ++day;
    main.innerHTML = "";
    dailyCharacters = [];
    dailyEvents = [];
    dailyAreas = [];
    window.scrollTo(0, 0);
    if (day == 4) {
        let _n = Math.random() * 3; //How many FTEvents are done before the murder
        for (let i = 0; i < _n; i++)
            doFTEvent();

        doMurder();
        doInvestigation();
    }
    else {
        if (day == 2)
            doMotive();

        while (dailyCharacters.length < livingCharacters.length)
            doFTEvent();
    }
}
//Add currently available FTEvents from setting to availableFTEvents
updateAvailableFTEvents();
//Day 1
dailyCharacters = [];
dailyEvents = [];
dailyAreas = [];
window.scrollTo(0, 0);
addTextToMain("Everyone gathered in " + setting.startingArea + ".");
addTextToMain(headmaster + " appeared and explained the rules of the killing game.");
addTextToMain("After the shock wore off, everyone split up to explore.");
while (dailyCharacters.length < livingCharacters.length)
    doFTEvent();