var NUM_OF_STUDIES = 15;
var NUM_OF_SCENARIOS = 15;
var CHAR_CODE_A = 65;
var RAND_STR_MAX_LEN = 10;

var randString = function(maxLen) {

    var letters = [];
    for (var i = 0; i < 26; i++) {
        var letter = String.fromCharCode(i + CHAR_CODE_A);
        letters.push(letter);
        letters.push(letter.toLowerCase());
    }

    letters.push(' ');

    var result = "";
    var strLen = Math.round(Math.random() * maxLen);
    for (var j = 0; j < strLen; j++) {
        var index = Math.floor(Math.random() * letters.length);
        result += letters[index];
    }

    if (result.length === 0) {
        result = " ";
    }
    return result;
}

var generateData = function() {
    var studies = [];
    for (var i = 0; i < NUM_OF_STUDIES; i++) {
        var scenarios = [];
        for (var j = 0; j < NUM_OF_SCENARIOS; j++) {
            scenarios.push({
                "name": "Scenario " + randString(RAND_STR_MAX_LEN)
            });
        }

        studies.push({
        	"name": "Study " + (i + 1),
        	"scenarios": scenarios
        });
    }

    console.log(JSON.stringify(studies, null, 4));

}

generateData();

