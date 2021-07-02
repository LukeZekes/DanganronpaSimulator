"use strict";
//Character class
class Character {
    constructor(name, talent) {
        this.name = name;
        this.talent = talent;
        this.role = "student" //Characters with the 'student' role are the characters other than the protag, antag and support
        this.isMastermind = false;
    }
    resetValues() { //This has to be done to prevent there from being multiple of a role if generate function is called multiple times
        this.role = "student";
        this.isMastermind = false;
    }
}
/*
class Setting {
    //Commented out areas in setting constructors are from when there were 6 arrays instead of 1 multi-dimensional array
    constructor(name, areas, startingArea, initialAreas, firstTrialAreas, secondTrialAreas, thirdTrialAreas, fourthTrialAreas, fifthTrialAreas, FTEvents) {
        this.name = name;
        this.areas = areas;
        
        this.startingArea = startingArea;
        this.initialAreas = initialAreas;
        this.firstTrialAreas = firstTrialAreas;
        this.secondTrialAreas = secondTrialAreas;
        this.thirdTrialAreas = thirdTrialAreas;
        this.fourthTrialAreas = fourthTrialAreas;
        this.fifthTrialAreas = fifthTrialAreas;
        
        this.FTEvents = FTEvents;
    }
}*/

class Setting {
    constructor(name, startingArea, areas, FTEvents) {
        this.name = name;
        this.startingArea = startingArea;
        this.areas = areas;
        this.FTEvents = FTEvents;
    }
}

class FTEvent {
    constructor(text, area, numCharacters) {
        this.text = text;
        this.area = area;
        this.numCharacters = numCharacters;
    }
}

var availableFTEvents = [new FTEvent("C1 decided to plot in their room.", "any", 1), new FTEvent("C1 and C2 played cards in C1's room.", "any", 2),
new FTEvent("C1 and C2 exercised together for a few hours at [location].", "any", 2), new FTEvent("C1 made lunch for C2 and C3.", "any", 3),
new FTEvent("C1 and C2 hung out at [location]", "any", 2), new FTEvent("C1 caught C2 and C3 chatting alone together in [location].", "any", 3),
new FTEvent("C1 and C2 discussed hopeful despair and despairing hope for three hours in [location].", "any", 2),
new FTEvent("C1 took a nap in their room.", "any", 1), new FTEvent("C1 spent some time alone in their room.", "any", 1),
new FTEvent("C1 panicked in their room.", "any", 1), new FTEvent("C1 visited C2 in their room.", "any", 2),
new FTEvent("C1 helped C2 recover from a panic attack.", "any", 2), new FTEvent("C1 and C2 delt with some pent up frustration in C1's room.", "any", 1),
new FTEvent("C1 tried to teach the basics of their talent to C2.", "any", 2), new FTEvent("C1 questioned if they have developed feelings for C2.", "any", 1),
new FTEvent("C1 spent some time stalking C2.", "any", 1),
new FTEvent("C1 took C2 to [location] and confessed their feelings. C2 said they felt the same way!", "any", 2),
new FTEvent("C1 took C2 to [location] and confessed their feelings. They said they didn't feel the same way, but appreciated the honesty.", "any", 2),
new FTEvent("C1 took C2 to [location] and confessed their feelings. They didn't feel the same way and got freaked out.", "any", 2),
new FTEvent("C1 and C2 told some bad jokes to ease the mood.", "any", 2),
new FTEvent("C1, C2, and C3 shit talked Monokuma until he appeared out of nowhere and yelled at them.", "any", 3),
new FTEvent("C1 and C2 shared stories from their childhood.", "any", 2),
new FTEvent("C1 and C2 arm wrestled at [location]. C1 managed to beat C2!", "any", 2),
new FTEvent("C1 and C2 arm wrestled at [location]. C2 overcame C1!", "any", 2),
new FTEvent("C1 and C2 arm wrestled at [location]. They both struggled for 5 minutes before calling it a tie", "any", 2)
]

const allSettings = [
    new Setting("Hope's Peak Academy", "the entrance hall", [
        //Initially available areas
        ["the gym", "the trophy room", "the dorms", "the cafeteria", "the entrance hall", "the A/V room",
            "the nurse's office", "classroom 1 - A", "classroom 1 - B", "the storage room", "the incinerator", "the bath house", "the laundry room", "the kitchen"],
        //Available after trial 1
        ["the girls locker room", "the boys locker room", "the swimming pool", "classroom 2 - A", "classroom 2 - B", "the library", "the archives"],
        //Available after trial 2
        ["classroom 3 - A", "classroom 3 - B", "the physics lab", "the lab storage room", "the art room", "the art storage room", "the rec room"],
        //Available after trial 3
        ["the music room", "the headmaster's office", "the faculty office", "the data center", "classroom 4 - A", "classroom 4 - B", "the chemistry lab"],
        //Available after trial 4
        ["the biology lab", "classroom 5 - A", "classroom 5 - B", "classroom 5 - C", "the martial arts dojo"],
        //Available after trial 5
        ["the old locker room", "the headmaster's private quarters", "the barricaded dorms", "the oddly intact dorm"]
    ], [new FTEvent("C1 exercised alone in the gym.", "the gym", 1),
    new FTEvent("C1 and C2 exercised together in the gym.", "the gym", 2),
    new FTEvent("C1 admired the trophies in the trophy room on their way to the gym.", "the trophy room", 1),
    new FTEvent("C1 played around with a gold leaf katana they found in the trophy room. They regretted it immediately after seeing the gold everywhere.", "the trophy room", 1),
    new FTEvent("C1 had lunch with C2 and C3 in the cafeteria.", "the cafeteria", 3),
    new FTEvent("C1, C2 and C3 tried to figure out how to open the door in the entrance hall.", "the entrace hall", 3),
    new FTEvent("C1 looked for a movie to watch in the A/V room.", "the A/V room", 1),
    new FTEvent("C1 scraped their knee, so C2 patched them up in the nurse's office.", "the nurse's office", 2),
    new FTEvent("C1 explored classroom 1-A for clues, but didn't find anything...", "classroom 1 - A", 1),
    new FTEvent("C1 explored classroom 1-A with C2, but they couldn't find any clues...", "classroom 1 - A", 2),
    new FTEvent("C1 explored classroom 1-B for clues, but didn't find anything...", "classroom 1 - B", 1),
    new FTEvent("C1 explored classroom 1-B with they C2, but didn't find any clues...", "classroom 1 - B", 2),
    new FTEvent("C1 wanted to write a letter to C2, and searched the storage room for stationary.", "the storage room", 1), //Since C2 should still be able to do things, the numCHaracters is set to 1 (which is addressed in the doFTE() function)
    new FTEvent("C1 cleaned their room, and took the trash to the incinerator.", "the incinerator", 1),
    new FTEvent("C1 wanted to relax in the bath house, but saw C2 was there first and got embarrassed", "the bath house", 2),
    new FTEvent("C1 lost a bet to C2 and had to do their laundry.", "the laundry room", 2),
    new FTEvent("C1 made themselves lunch in the kitchen.", "the kitchen", 1),

    new FTEvent("C1 investigated the locker rooms with C2.", "the girls locker room", 2),//Doesn't matter which room since they are both available at the same time
    new FTEvent("C1 decided to go for a swim, and got water in their nose.", "the swimming pool", 1),
    new FTEvent("C1 decided to go for a swim, and practiced holding their breath underwater.", "the swimming pool", 1),
    new FTEvent("C1 and C2 raced each other in the swimming pool.", "the swimming pool", 2),
    new FTEvent("C1 and C2 investigated classroom 2-A.", "classroom 2 - A", 2),
    new FTEvent("C1 searched for clues in classroom 2-A alone.", "classroom 2 - A", 1),
    new FTEvent("C1 and C2 investigated classroom 2-B.", "classroom 2 - B", 2),
    new FTEvent("C1 searched for clues in classroom 2-B alone.", "classroom 2 - B", 1),
    new FTEvent("C1 asked C2 to meet them privately in the library.", "the library", 2),
    new FTEvent("C1 searched the archives for any clues about the school or Monokuma.", "the archives", 1),
    new FTEvent("C1 and C2 searched the archives for any new information.", "the archives", 2),
    new FTEvent("C1 and C2 searched the archives for any new information.", "the archives", 2),

    new FTEvent("C1 searched classroom 3-A for clues.", "classroom 3 - A", 1),
    new FTEvent("C1 joined C2 in searching classroom 3-A for clues.", "classroom 3 - A", 2),
    new FTEvent("C1 explored classroom 3-B head-to-toe by themselves.", "classroom 3 - B", 1),
    new FTEvent("C1 looked in classroom 3-B and found C2 also searching there.", "classroom 3 - B", 2),
    new FTEvent("C1 tried to figure out the strange machines in the physics lab, with no luck.", "the physics lab", 1),
    new FTEvent("C1 managed to turn on one of the machines in the physics lab, but it didn't seem to do anything...", "the physcis lab", 1),
    new FTEvent("C1 stashed something in the lab storage room...", "the lab storage room", 1),
    new FTEvent("C1 and C2 had a painting competition in the art room. C1 won!", "the art room", 2),
    new FTEvent("C1 and C2 had a painting competition in the art room. C2 won!", "the art room", 2),
    new FTEvent("C1 and C2 had a painting competition in the art room. It was a tie.", "the art room", 2),
    new FTEvent("C1 and C2 had a sculpting competition in the art room. C1 won!", "the art room", 2),
    new FTEvent("C1 and C2 had a sculpting competition in the art room. C2 won!", "the art room", 2),
    new FTEvent("C1 and C2 had a sculpting competition in the art room. It was a tie", "the art room", 2),
    new FTEvent("C1 made wax stamps with supplies they found in the art storage room.", "the art storage room", 1),
    new FTEvent("C1 made a clay figurine with supplies they found in the art storage room.", "the art storage room", 1),
    new FTEvent("C1 played pool against C2 in the rec room. C1 won!", "the rec room", 2),
    new FTEvent("C1 played pool against C2 in the rec room. C2 won!", "the rec room", 2),

    new FTEvent("C1 tried to compose a song in the music room.", "the music room", 1),
    new FTEvent("C1 put on a concert for C2 and C3 in the music room.", "the music room", 3),
    new FTEvent("C1 put on a concert in the music room, but nobody showed up...", "the music room", 3),
    new FTEvent("C1 and C2 tried to break into the headmaster's office, to no avail.", "the headmaster's office", 2),
    new FTEvent("C1 and C2 tried to break into the headmaster's office, but Monokuma showed up and yelled at them.", "the headmaster's office", 2),
    new FTEvent("C1 stole a fake plant from the faculty office.", "the faculty office", 1),
    new FTEvent("C1 tried to hack the computers in the faculty office, but they turned out to be fake.", "the faculty office", 1),
    new FTEvent("C1 spent some time fiddling with the computers in the data center.", "the data center", 1),
    new FTEvent("C1 scrawled something rude about C2 on the chalkboard in classroom 4-A.", "classroom 4 - A", 1),
    new FTEvent("C1 searched classroom 4-B for clues, but only found a self-portrait done by Monokuma.", "classroom 4 - B", 1),
    new FTEvent("C1 showed C2 how to make salt crystals in the chemistry lab.", "the chemistry lab", 2),
    new FTEvent("C1 visited the chemistry lab to try and make alcohol, but set it on fire.", "the chemistry lab", 1),
    new FTEvent("C1 visited the chemistry lab to try and make alcohol, but was caught by C2.", "the chemistry lab", 2),
    new FTEvent("C1 visited the chemistry lab to try and make alcohol, but was caught by Monokuma.", "the chemistry lab", 1),

    new FTEvent("C1 and C2 had a contest to see who could stand the cold in the biology lab the longest.", "the biology lab", 1),
    new FTEvent("C1 paid their respects to the bodies being kept in the morgue.", "the biology lab", 1),
    new FTEvent("C1 and C2 trained in the martial arts dojo.", "the martial arts dojo", 2),
    new FTEvent("C1 and C2 sparred in the martial arts dojo.", "the martial arts dojo", 2),
    new FTEvent("C1 and C2 both searched for clues in classroom 5-A.", "classroom 5 - A", 2),
    new FTEvent("C1 looked for clues in classroom 5-A.", "classroom 5 - A", 1),
    new FTEvent("C1 practiced their signature on the chalkboard in classroom 5-B.", "classroom 5 - B", 1),
    new FTEvent("C1 threw up trying to investigate classroom 5-C.", "classroom 5 - C", 1),
    new FTEvent("C1 investigated classroom 5-C to try and figure out what happened.", "classroom 5 - C", 1),

    new FTEvent("C1 found some of C2's belongings in the old locker room, but C2 claimed not to recognize them.", "the old locker room", 2),
    new FTEvent("C1 searched for answers in the headmaster's private quarters, but only found old family photos.", "the headmaster's private quarters", 1),
    new FTEvent("C1 helped C2 try to enter one of the barricaded dorms on the second floor.", "the barricaded dorms"),
    new FTEvent("C1 tried to find clues in the oddly intact dorm.", "the oddly intact dorm", 1),
    new FTEvent("C1 found C2 searching the headmaster's private quarters", "the headmaster's private quarters", 2)
    ]),

    new Setting("Jabberwock Island", "Jabberwock Park", [
        ["Jabberwock Park", "Monokuma Rock", "the first island", "the beach", "the airport", "Rocketpunch Market", "Usami Corral",
            "Hotel Mirai", "the hotel lobby", "the hotel restaurant", "the hotel's old building"],
        ["the pharmacy", "the ancient ruins", "the library", "the diner", "Chandler Beach", "the beach house"],
        ["the hospital lobby", "the hospital", "the Titty Typhoon", "the motel", "Electric Ave.", "the movie theater"],
        ["the haunted house", "Nezumi Castle", "the rollercoaster", "the Funhouse"],
        ["Jabberwock Military Base", "the plushie factory", "the warehouse", "Vendor Street", "Sea King Industries"],
        ["Hope's Peak Academy"]
    ], []),

    new Setting("The Ultimate Academy for Gifted Juveniles", "the gym", [
        ["the student dormitory", "the Shrine of Judgement", "the library", "the game room", "the A/V room", "the gymnasium", "the dining hall",
            "classroom A", "classroom B", "classroom C", "the restrooms", "the Ultimate Pianist Lab", "the courtyard", "the Ultimate Inventor Lab"],
        ["the Ultimate Maid Lab", "the Ultimate Entomologist Lab", "the Ultimate Tennis Pro Lab", "the Ultimate Assassin's Lab", "the casino", "Hotel Kumasutra",
            "the pool", "the Ultimate Magician Lab"],
        ["the Ultimate Anthropologist Lab", "the Ultimate Artist Lab", "the Ultimate Akido Master Lab", "the Computer Room"],
        ["the Ultimate Cosplayer Lab", "the Ultimate Detective Lab", "the Ultimate Robot Lab"],
        ["the Ultimate Astronaut Lab", "the Ultimate ??? Lab", "the Cyber Courtyard", "the Exisal hangar"],
        ["the hidden room", "the Ultimate Supreme Leader Lab"]
    ],
        [])
];
//Defining arrays of all characters and settings.
const allCharacters = [
    //THH Characters
    new Character("Kyoko Kirigiri", "Detective"), new Character("Makoto Naegi", "Lucky Student"), new Character("Chihiro Fujisaki", "Programmer"),
    new Character("Byakuya Togami", "Affluent Progeny"), new Character("Sakura Ogami", "Martial Artist"), new Character("Junko Enoshima", "Fashionista"),
    new Character("Toko Fukawa", "Writing Prodigy"), new Character("Sayaka Maizono", "Pop Sensation"), new Character("Mukuro Ikusaba", "Solider"),
    new Character("Aoi Asahina", "Swimmer"), new Character("Yasuhiro Hagakure", "Clairvoyant"), new Character("Mondo Owada", "Biker Gang Leader"),
    new Character("Leon Kuwata", "Baseball Star"), new Character("Celestia Ludenberg", "Gambler"), new Character("Kiyotaka Ishimaru", "Moral Compass"),
    new Character("Hifumi Yamada", "Fanfic Creator"),
    //SDR2 Characters
    new Character("Nagito Komaeda", "Lucky Student"), new Character("Hajime Hinata", "???"), new Character("Fuyuhiko Kuzuryu", "Yakuza"),
    new Character("Peko Pekoyama", "Swordswoman"), new Character("Nekomaru Nidai", "Team Manager"), new Character("Gundham Tanaka", "Breeder"),
    new Character("Ibuki Mioda", "Musician"), new Character("Sonia Nevermind", "Princess"), new Character("Ultimate Imposter", "Impostor"),
    new Character("Akane Owari", "Gymnast"), new Character("Kazuichi Soda", "Mechanic"), new Character("Mikan Tsumiki", "Nurse"),
    new Character("Mahiru Koizumi", "Photographer"), new Character("Chiaki Nanami", "Gamer"), new Character("Hiyoko Saionji", "Traditional Dancer"),
    new Character("Teruteru Hanamura", "Cook"),
    //V3 Characters
    new Character("Kokichi Oma", "Supreme Leader"), new Character("Ryoma Hoshi", "Tennis Pro"), new Character("Gonta Gokuhara", "Entomologist"),
    new Character("Rantaro Amami", "???"), new Character("Kirumi Tojo", "Maid"), new Character("Maki Harukawa", "Assassin"),
    new Character("Shuichi Saihara", "Detective"), new Character("K1-B0", "Robot"), new Character("Miu Iruma", "Inventor"), new Character("Kaede Akamatsu", "Pianist"),
    new Character("Korekiyo Shinguji", "Anthropologist"), new Character("Himiko Yumeno", "Magician"), new Character("Kaito Momota", "Astronaut"),
    new Character("Angie Yonaga", "Artist"), new Character("Tsumugi Shirogane", "Cosplayer"), new Character("Tenko Chabashira", "Aikido Master")];

var availCharacters;
var availSettings;
//Store these arrays in the browser storage
sessionStorage.setItem('allCharacters', JSON.stringify(allCharacters));
sessionStorage.setItem('allSettings', JSON.stringify(allSettings));

var protagonist, antagonist, support, mastermind, setting;
var otherCharacters; //The 13 other characters
var currentCharacters; //The characters in this game, including protag, antag and support

//Assigning fields to display text
var protagField = document.getElementById('protagField');
var antagField = document.getElementById('antagField');
var supportField = document.getElementById('supportField');
var settingField = document.getElementById('settingField');

function doRandomGenerate() {
    //Store available characters and settings, to allow for customization - if I do add the ability to customize the pool, these should be moved out of this function
    //and replaced with temporary ones
    availCharacters = [...allCharacters]; //Updates as each character is added to avoid duplicates
    availSettings = [...allSettings];

    otherCharacters = [];
    currentCharacters = [];

    availCharacters.forEach(doReset);
    function doReset(item, index) {
        item.resetValues();
    }
    //Pick protagonist randomly
    let temp = Math.floor(Math.random() * availCharacters.length);
    protagonist = availCharacters[temp];
    protagonist.role = "protagonist";
    //Update page to reflect chosen protagonist
    protagField.innerHTML = protagonist.name;
    console.log(protagonist);
    //Remove protagonist from array of available characters
    availCharacters.splice(temp, 1);

    //Do same for mastermind (except do not remove them from array of available characters, so their is a chance to be support/antagonist)
    temp = Math.floor(Math.random() * availCharacters.length);
    mastermind = availCharacters[temp];
    mastermind.isMastermind = true;

    console.log(mastermind);

    //Do same for antagonist
    temp = Math.floor(Math.random() * availCharacters.length);
    antagonist = availCharacters[temp];
    antagonist.role = "antagonist";
    antagField.innerHTML = antagonist.name;
    console.log(antagonist);
    availCharacters.splice(temp, 1);

    //Do same for support
    temp = Math.floor(Math.random() * availCharacters.length);
    support = availCharacters[temp];
    support.role = "support";
    supportField.innerHTML = support.name;
    console.log(support);
    availCharacters.splice(temp, 1);
    //If the mastermind is antagonist or support, then 13 more students are needed & mastermind should not be added to currentCharacters
    if (antagonist.isMastermind || support.isMastermind) {
        //Add 13 other students
        for (let i = 0; i < 13; i++) {
            temp = Math.floor(Math.random() * availCharacters.length);
            otherCharacters.push(availCharacters[temp]);
            availCharacters.splice(temp, 1);
        }
        //Add all chosen students to one array and sort
        currentCharacters = otherCharacters;
        currentCharacters.push(protagonist, antagonist, support);
    }
    //If mastermind is not an already established character, then only 12 more students are needed but mastermind needs to be added to currentCharacters
    else {
        //Add 12 other students
        for (let i = 0; i < 12; i++) {
            temp = Math.floor(Math.random() * availCharacters.length);
            otherCharacters.push(availCharacters[temp]);
            availCharacters.splice(temp, 1);
        }
        //Add all chosen students (including mastermind) to one array and sort
        currentCharacters = otherCharacters;
        currentCharacters.push(protagonist, antagonist, support, mastermind);
    }

    currentCharacters.sort((a, b) => a.name > b.name ? 1 : -1);
    console.log(currentCharacters);

    //Pick setting randomly
    temp = Math.floor(Math.random() * availSettings.length);
    setting = availSettings[temp];
    //Update page to reflect chosen setting
    settingField.innerHTML = setting.name;
    console.log(setting);
    //Update UAFGJ areas to have ultimate labs for only the characters being used
    if (setting.name == "The Ultimate Academy for Gifted Juveniles") {
        let tempIndex = 0;
        for (let i = 0; i < setting.areas.length; i++) {
            for (let k = 0; k < setting.areas[i].length; k++) {
                let input = setting.areas[i][k];
                if (input.indexOf("the Ultimate") != -1) {
                    setting.areas[i][k] = "the Ultimate " + currentCharacters[tempIndex].talent + " Lab";
                    tempIndex++;
                }
            }
        }
    }
    //Store all current characters, protag, antag, support, other characters and setting in session broswer storage (does not persist between sessions)
    //I don't know PHP or whatever the right language to send date between pages is so we're doing this
    sessionStorage.setItem('otherCharacters', JSON.stringify(otherCharacters));
    sessionStorage.setItem('protagonist', JSON.stringify(protagonist));
    sessionStorage.setItem('antagonist', JSON.stringify(antagonist));
    sessionStorage.setItem('support', JSON.stringify(support));
    sessionStorage.setItem('mastermind', JSON.stringify(mastermind));
    sessionStorage.setItem('setting', JSON.stringify(setting));
    sessionStorage.setItem('currentCharacters', JSON.stringify(currentCharacters));
    sessionStorage.setItem('availableFTEvents', JSON.stringify(availableFTEvents));
}