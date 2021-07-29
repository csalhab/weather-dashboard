//DEPENDENCIES =================================================================
var searchCityBtn = $(".searchButton");

var weatherInfoContainerEl = $(".weatherInfoContainer");

var olCreated = false;
var olEl = $("<ol>");

var citySearchResults;
var cityEntries;

//[BUILD] call moment:
var now = moment();

var comboWords = "";

var weatherIcon;



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
            //olEl.attr("id", "selectable");
            var olContainerEl = $(".vh-100");
            olContainerEl.append(olEl);
            olCreated = true;
        }
        //lists of cities on the left side
        console.log("creating li now");
        var liEl = $("<li>");
        liEl.attr("class", "cityOnLeft");
        liEl.text(properCapitalization);
        olEl.append(liEl);

        var cityDateIcon = $(".cityDateIconContainer");
        cityDateIcon.text(properCapitalization + " (" + now.format("L") + ")");
        
        var weatherTop = $(".col-md-8");
        weatherTop.css("visibility", "visible");

        var baseURL = "https://api.openweathermap.org/data/2.5/weather";
        var addCity = "q=";
        var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
        //https://openweathermap.org/current#data
        //For temperature in Fahrenheit use units=imperial
        var units = "units=imperial";
        //http://api.openweathermap.org/data/2.5/weather?q=Miami&appid=aa772c06902f60c4e5f5e833c0ce31f4
        var constructedWeatherUrl = baseURL + "?" + addCity + userCityInput + "&" + units + "&" + addAPIKey;

        fetch(constructedWeatherUrl, {
            method: "GET", //GET is the default.
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
        })
        .then(function (response) {
            //if (response.status === 200) {
                return response.json();
            //} else {
                //alert("Oops!! Open Weather Map is not available at this time.")
            //}
        })
        .then(function (data) {
            console.log(data);
            //console.log(data.weather[0].description);
            weatherIcon = data.weather[0].icon;
            //console.log("icon: " + weatherIcon);

            //https://openweathermap.org/img/wn/04n.png
            //icon value returned goes at end before .png
            var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            var weatherIconEl = $("<img>");
            weatherIconEl.attr("src", iconURL);
            weatherIconEl.attr("width", "50px");
            weatherIconEl.attr("height", "50px");
            cityDateIcon.append(weatherIconEl);

            //var weatherInfoContainerEl = $(".weatherInfoContainer");
            var tempF = data.main.temp;
            var tempFEl = $("<p>");
            tempFEl.text("Temp: " + tempF + "°F");
            weatherInfoContainerEl.append(tempFEl);

            var wind = data.wind.speed;
            var windEl = $("<p>");
            windEl.text("Wind: " + tempF + " MPH");
            weatherInfoContainerEl.append(windEl);

            var humidity = data.main.humidity;
            var humidityEl = $("<p>");
            humidityEl.text("Humidity: " + humidity + " %");
            weatherInfoContainerEl.append(humidityEl);

            //uvindex not included as it is deprecated in current API
            //they have One API but requires Longitude/Latitude API fyi

            do5DayForecast(userCityInput);
        })
        .catch(function (err) {
            alert("Please make sure you entered a valid city name.");

        });
    }
}

function handleLetterCasing(origCityCasing) {
    
    words = origCityCasing.split(" ");
    //this handles capitalizing multiple words city name
    if (words.length > 1) {
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

function do5DayForecast(userCity) {
    var baseURL = "https://api.openweathermap.org/data/2.5/forecast";
    var addCity = "q=";
    //https://openweathermap.org/current#data
    //For temperature in Fahrenheit use units=imperial
    var units = "units=imperial";
    var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
    //Example URL http://api.openweathermap.org/data/2.5/forecast?q=Miami&units=imperial&appid=aa772c06902f60c4e5f5e833c0ce31f4
    var constructedForecastUrl = baseURL + "?" + addCity + userCity + "&" + units + "&" + addAPIKey;

    fetch(constructedForecastUrl, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
    })
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Oops!! Open Weather Map Forecast is not available at this time.")
        }
    })
    .then(function (data) {
        console.log("forecast time..");
        console.log(data);
        var day = 1;
        // var tomorrow = now.add(1, 'day').endOf('day').format("L");
        // var twoDaysFromNow = now.add(1, 'day').endOf('day').format("L");
        // var threeDaysFromNow = now.add(1, 'day').endOf('day').format("L");
        // var fourDaysFromNow = now.add(1, 'day').endOf('day').format("L");
        // var fiveDaysFromNow = now.add(1, 'day').endOf('day').format("L");
        //console.log("tomorrow: " + tomorrow + " twoDaysFromNow: " + twoDaysFromNow + " threeDaysFromNow: " + threeDaysFromNow);
        //console.log("fourDaysFromNow: " + fourDaysFromNow + " fiveDaysFromNow: " + fiveDaysFromNow);
        //ugh OWM 5day forecast returns every 3 hours per day based on current time, lots of items
        //so pulling just the 12noon timestamp item and its temp, wind & humidity
        //ex: 2021-07-30 03:00:00, 2021-07-30 06:00:00, 2021-07-30 09:00:00 
        //ex of 12noon timestamp: 2021-07-30 12:00:00, starts on 11th index so extract it starting there
        //console.log("midday items: ");
        for(var i = 0; i < data.list.length; i++){
            //console.log(data.list[i].dt_txt);
            var date = data.list[i].dt_txt.substring(11);
            //console.log(data.list[i].dt_txt.substring(11));
            var forecastTemp = data.list[i].main.temp;
            var forecastWind = data.list[i].wind.speed;
            var forecastHumidity = data.list[i].main.humidity;
            var forecastIcon = data.list[i].weather[0].icon;
            //if 12noon is found, extract temp, wind & humidity
            if (date.indexOf("12:00:00") > -1) {
                // console.log("date: " + date);
                // console.log("forecastTemp: " + forecastTemp);
                // console.log("forecastWind: " + forecastWind);
                // console.log("forecastHumidity: " + forecastHumidity);
                // console.log("forecastIcon: " + forecastIcon);
                showForecastWeatherInfo(day, now.add(1, 'day').endOf('day').format("L"), forecastTemp, forecastWind, forecastHumidity, forecastIcon);
                day++;
            }
        }
    });

}

function showForecastWeatherInfo(forecastDay, forecastDate, forecastTempF, forecastWindMPH, forecastHumidityPerc, forecastIconNum) {

        var forecastContainer = $(".fivedayforecastContainer");

        var forecastDay1 = $(".forecastDay" + forecastDay);
        forecastDay1.text(forecastDate);

        //https://openweathermap.org/img/wn/04n.png
        //icon value returned goes at end before .png
        var iconURL = "https://openweathermap.org/img/wn/" + forecastIconNum + ".png";
        var forecastIconEl = $("<img>");
        forecastIconEl.attr("src", iconURL);
        forecastIconEl.attr("width", "50px");
        forecastIconEl.attr("height", "50px");

        forecastDay1.append(forecastIconEl);

        var forecastInfoContainerEl = $(".forecastInfoContainer");
        var forecastTempFEl = $("<p>");
        forecastTempFEl.text("Temp: " + forecastTempF + "°F");
        forecastDay1.append(forecastTempFEl);

        var forecastWindEl = $("<p>");
        forecastWindEl.text("Wind: " + forecastWindMPH + " MPH");
        forecastDay1.append(forecastWindEl);

        var forecastHumidityEl = $("<p>");
        forecastHumidityEl.text("Humidity: " + forecastHumidityPerc + " %");
        forecastDay1.append(forecastHumidityEl);

        forecastContainer.append(forecastDay1);
        //fix reset current day for next searches
        if (forecastDay === 5) {
            //console.log("5day hit!");
            now = moment();
        };
}

//USER INTERACTIONS ============================================================

//INITIALIZATION ===============================================================

searchCityBtn.on("click", function (event) {
    event.preventDefault();
    console.log("clicked");
    comboWords = "";
    weatherInfoContainerEl.empty();
    
    //console.log("save button " + event.target.id + " clicked");
    //console.log(event.currentTarget.parentNode.children[0].childNodes[0].textContent);
    var cityInput = $("#cityInput").val();
    console.log("cityInput: " + cityInput);
    searchCity(cityInput);
});


//store cityEntries in local storage
//
//retrieve cityEntries from local storage
//var lastCityEntries = JSON.parse(localStorage.getItem("cityEntries"));
//if (lastCityEntries !== null) {
//
//   lastCityEntries = [];
//}