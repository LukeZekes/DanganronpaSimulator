"use strict";
let motives = ["the blackened will get to meet anyone they want.", "the blackened will get $" + (Math.floor(Math.random() * 10) * 10 + 10) + " million.",
    "the blackened will get to see their family again."];
let usedMotives = [];
let main = document.getElementById('main');
let setting = JSON.parse(sessionStorage.getItem('setting'));
let livingCharacters = JSON.parse(sessionStorage.getItem('currentCharacters'));
let availableAreas = setting.areas[0];
let availableFTEvents = JSON.parse(sessionStorage.getItem('availableFTEvents'));
let dailyCharacters; //Reperesents the characters which have already participated in a free time event (FTEvent) on a given day
let dailyEvents; //Represents the FTEvents that have already taken place on a given day
let dailyAreas;
let openEventTag = "<p class=\"dayEvent\">"; //A day event is anything that happens during a day
let closeEventTag = "</p>";
let day = 1;
let dayElement = document.getElementById("day");

let numMurders = 0;
let victim, culprit;
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
    if (dailyEvents.indexOf(_e) == -1) {
        if (livingCharacters.length > (_e.numCharacters + dailyCharacters.length)) {
            if (_e.area == "any") {
                return true;
            }
            else if (!dailyAreas.includes(_e.area)) {
                return true;
            }
            
        }
    }
    return false;
    //This is stupid I hate javascript
}
function doFTEvent() {
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
    else {
        let e;
        let _text;
        let _character;
        do {
            //Pick an event
            e = availableFTEvents[Math.floor(Math.random() * availableFTEvents.length)]
        } while (!checkFTEvent(e));
        //Make sure the chosen event will not be chosen again that day
        dailyEvents.push(e);
        if (e.area != "any") {
            dailyAreas.push(e.area);
        }
        _text = e.text;
        //Repeat for the number of characters in the FTEvent (given by e.numCharacters)
        for (let i = 1; i <= e.numCharacters; i++) {
            //Choose a character
            do {
                _character = livingCharacters[Math.floor(Math.random() * livingCharacters.length)];
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
            } while (dailyCharacters.indexOf(_character) != -1);
            //Replace all C# with the character
            do {
                _text = _text.replace("C" + x, _character.name);
            } while (_text.indexOf("C" + x) != -1);
        }
       // console.log(_text);
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
        if ((availableFTEvents.indexOf(e) == -1) && ((e.area == "any") || (availableAreas.indexOf(e.area) != -1))) {
            temp.push(e);
            //console.log("Updated availableFTEvents: " + e.text);
        }
    }
    availableFTEvents = availableFTEvents.concat(temp);
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
    addTextToMain("Monokuma called everyone to " + setting.startingArea + " for an important announcement.");
    addTextToMain("He announced a new motive to spice up the killing game: <span class='motive'>" + _motive + "</span>");
}
function doMurder() {
    let tempIndex = Math.floor(Math.random() * livingCharacters.length);
    //Pick victim
    victim = livingCharacters[tempIndex];
    livingCharacters.splice(tempIndex, 1)
    //Pick culprit (can't be victim because they were removed from livingCharacters)
    tempIndex = Math.floor(Math.random() * livingCharacters.length);
    culprit = livingCharacters[tempIndex];

   // console.log("Victim: " + victim.name + "\nCulprit: " + culprit.name);
    //How many people find the body and where
    let _location = availableAreas[Math.floor(Math.random() * availableAreas.length)];
    let num = Math.floor(Math.random() * 3) + 1; //Between 1 and 3 people will find the body
    let r = Math.random() > 0.5;
    let char1 = randomFromArray(livingCharacters).name;
    let char2, char3;
    switch (num) {
        case 1:
            r ? addTextToMain(`<span class='death'>${char1} found ${victim.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim.name}'s body was found in ${_location} by ${char1}!</span>`);
            break;
        case 2:
            do {
                char2 = randomFromArray(livingCharacters).name;
            } while (char2 == char1);
            r ? addTextToMain(`<span class='death'>${char1} and ${char2} found ${victim.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim.name}'s body was found in ${_location} by ${char1} and ${char2}!</span>`);
            break;
        case 3:
            do {
                char2 = randomFromArray(livingCharacters).name;
            } while (char2 == char1);
            do {
                char3 = randomFromArray(livingCharacters).name;
            } while (char3 == char1 || char3 == char2);
            r ? addTextToMain(`<span class='death'>${char1}, ${char2} and ${char3} found ${victim.name}'s corpse in ${_location}!</span>`) :
                addTextToMain(`<span class='death'>${victim.name}'s body was found in ${_location} by ${char1}, ${char2} and ${char3}!</span>`);
            break;
    }
}
function doInvestigation() {
    main.innerHTML += "<p class='investigationTime'>-Investigation time!-</p>"
}
function nextDay() {
    dayElement.innerHTML = ++day;
    main.innerHTML = "";
    dailyCharacters = [];
    dailyEvents = [];
    dailyAreas = [];
    window.scrollTo(0, 0);
    if (day == 4) {
       doMurder();
       doInvestigation();
    }
    else {
        if (day == 2) {
            doMotive();
        }

        for (let i = 0; i < 8; i++) {
            doFTEvent();
        }
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
addTextToMain("Monokuma appeared and explained the rules of the killing game.");
addTextToMain("After the shock wore off, everyone split up to explore.");
doFTEvent();
doFTEvent();
doFTEvent();
doFTEvent();