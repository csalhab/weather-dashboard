//DEPENDENCIES =================================================================
var searchCityBtn = $(".searchButton");

var olCreated = false;
var olEl = $("<ol>");

var citySearchResults;
var obj;
var cityEntries;

//[BUILD] call moment:
var now = moment();

var comboWords = "";

//gets current hour from momentjs now variable
//returns in military 24 hr time
var hour = now.hour();
console.log("moment date: " + now.format("L"));
//console.log(hour);
//convert/format to standard time 
//var standardHour = moment(hour, "H").format("h");

//DATA =========================================================================

//FUNCTIONS ====================================================================

function searchCity(userCityInput) {

    var properCapitalization = handleLetterCasing(userCityInput);
    console.log("proper? " + properCapitalization);

    if (!userCityInput) {
        alert("You must enter a city to be able to search for its weather.");
    } else {
        if(!olCreated) {
            console.log("first one created");
            olEl.attr("id", "selectable");
            var olContainerEl = $(".olContainer");
            olContainerEl.append(olEl);
            olCreated = true;
        }
        console.log("creating li now");
        var liEl = $("<li>");
        liEl.attr("class", "ui-widget-content");
        liEl.text(properCapitalization);
        olEl.append(liEl);

        var cityDateTitle = $(".cityWeatherContainer");
        cityDateTitle.text(properCapitalization + " " + now.format("L"));
        var weatherTop = $(".col-md-8");
        weatherTop.css("visibility", "visible");


        var baseUrl = "http://api.openweathermap.org/data/2.5/weather";
        var addCity = "q=";
        var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
        //https://openweathermap.org/current#data
        //For temperature in Fahrenheit use units=imperial
        var units = "units=imperial";
        //http://api.openweathermap.org/data/2.5/weather?q=Miami&appid=aa772c06902f60c4e5f5e833c0ce31f4
        var constructedUrl = baseUrl + "?" + addCity + userCityInput + "&" + units + "&" + addAPIKey;

        fetch(constructedUrl, {
        method: "GET", //GET is the default.
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.weather[0].description);
            // citySearchResults = data;
            // console.log(citySearchResults.length);
            // for (var i=0; i<citySearchResults.length; i++) {
            //     console.log(citySearchResults[i]);
            // }
            handleWeatherIcon();
        })
        .catch( function( err ) { 
            // Error 
        });
    }
}

function handleLetterCasing(origCityCasing) {
    
    words = origCityCasing.split(" ");
    //this handles capitalizing multiple words city name
    if (words.length > 2) {
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            comboWords = comboWords + " " + words[i];
        }
        return comboWords;
    } else { //this handles capitalizing single word city name
        var lowerCaseCity = origCityCasing.toLowerCase();
        var initialLetterUpperCase = origCityCasing.charAt(0).toUpperCase();
        var initialUpperCaseCity = initialLetterUpperCase + lowerCaseCity.slice(1);
        return initialUpperCaseCity;
    }
}

function handleWeatherIcon() {
    //https://openweathermap.org/img/wn/04n@2x.png
    //icon value returned goes before @
}

//USER INTERACTIONS ============================================================

//INITIALIZATION ===============================================================

searchCityBtn.on("click", function (event) {
    event.preventDefault();
    console.log("clicked");
    //console.log("save button " + event.target.id + " clicked");
    //console.log(event.currentTarget.parentNode.children[0].childNodes[0].textContent);
    var cityInput = $("#cityInput").val();
    console.log("cityInput: " + cityInput);
    searchCity(cityInput);
});

//retrieve cityEntries from local storage
//var lastCityEntries = JSON.parse(localStorage.getItem("cityEntries"));
//if (lastCityEntries !== null) {
//
//   lastCityEntries = [];
//}