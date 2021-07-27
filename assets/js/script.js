//DEPENDENCIES =================================================================
var searchCityBtn = $(".searchButton");

var olCreated = false;
var olEl = $("<ol>");

var citySearchResults;
var obj;
var cityEntries;

//[BUILD] call moment:
var now = moment();

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
    var lowerCaseCity = userCityInput.toLowerCase();
    console.log("inside searchCity, lowercase: " + lowerCaseCity);
    var initialLetterUpperCase = userCityInput.charAt(0).toUpperCase();
    console.log("inside searchCity, initial uppercase: " + initialLetterUpperCase);
    console.log(initialLetterUpperCase + lowerCaseCity.slice(1));
    var initialUpperCaseCity = initialLetterUpperCase + lowerCaseCity.slice(1);

    cityEntries.push({city: initialUpperCaseCity);
    localStorage.setItem("cityEntries", JSON.stringify(cityEntries));


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
        liEl.text(initialUpperCaseCity);
        olEl.append(liEl);


        var baseUrl = "http://api.openweathermap.org/data/2.5/weather?";
        var addCity = "q=";
        var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
        //http://api.openweathermap.org/data/2.5/weather?q=Miami&appid=aa772c06902f60c4e5f5e833c0ce31f4
        var constructedUrl = baseUrl + addCity + userCityInput + "&" + addAPIKey;

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
            // citySearchResults = data;
            // console.log(citySearchResults.length);
            // for (var i=0; i<citySearchResults.length; i++) {
            //     console.log(citySearchResults[i]);
            // }
        })
        .catch( function( err ) { 
            // Error 
        }); 

        var cityDateTitle = $(".cityWeatherContainer");
        cityDateTitle.text(initialUpperCaseCity + " " + now.format("L"));
    }
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