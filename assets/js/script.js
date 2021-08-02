//DEPENDENCIES =================================================================
var searchCityBtn = $(".searchButton");

var weatherInfoContainerEl = $(".weatherInfoContainer");

var olCreated;
var olEl = $("<ol>");

var properCapitalization;
var cityEntries;
var forecastEntries;

//[BUILD] call moment:
var now = moment();

var comboWords = "";

var weatherIcon;



//gets current hour from momentjs now variable
//returns in military 24 hr time
var hour = now.hour();

//convert/format to standard time if needed
//var standardHour = moment(hour, "H").format("h");

//DATA =========================================================================

//FUNCTIONS ====================================================================

function searchCity(userCityInput) {

    properCapitalization = handleLetterCasing(userCityInput);
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
        
        var weatherTop = $(".col-md-10");
        weatherTop.css("visibility", "visible");

        var baseURL = "https://api.openweathermap.org/data/2.5/weather";
        var addCity = "q=";
        var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
        //https://openweathermap.org/current#data
        //For temperature in Fahrenheit use units=imperial
        var units = "units=imperial";
        //http://api.openweathermap.org/data/2.5/weather?q=Miami&appid=aa772c06902f60c4e5f5e833c0ce31f4
        var constructedWeatherURL = baseURL + "?" + addCity + userCityInput + "&" + units + "&" + addAPIKey;

        fetch(constructedWeatherURL, {
            method: "GET", //GET is the default.
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            weatherIcon = data.weather[0].icon;

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

            //simplified now into a variable to store
            var storedDate = "(" + now.format("L") + ")";

            console.log("pushing cityEntries..");
            console.log("cityEntries objects properCapitalization: " + properCapitalization);
            console.log("cityEntries objects properCapitalization: " + storedDate);
            console.log("cityEntries objects properCapitalization: " + tempF);
            console.log("cityEntries objects properCapitalization: " + wind);
            console.log("cityEntries objects properCapitalization: " + humidity);
            console.log("cityEntries objects properCapitalization: " + iconURL);
            
            //add objects to array/build for local storage
            cityEntries.push({cityName: properCapitalization, date: storedDate, temperature: tempF, windSpeed: wind, humidityPercentage: humidity, weatherImage: iconURL});


            console.log("cityEntries push completed..");

            //save in localstorage
            localStorage.setItem("cityEntries", JSON.stringify(cityEntries));


            console.log("cityEntries setItem completed..");

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

    console.log("inside do5DayForecast..")
    
    var baseURL = "https://api.openweathermap.org/data/2.5/forecast";
    var addCity = "q=";
    //https://openweathermap.org/current#data
    //For temperature in Fahrenheit use units=imperial
    var units = "units=imperial";
    var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
    //Example URL http://api.openweathermap.org/data/2.5/forecast?q=Miami&units=imperial&appid=aa772c06902f60c4e5f5e833c0ce31f4
    var constructedForecastURL = baseURL + "?" + addCity + userCity + "&" + units + "&" + addAPIKey;

    fetch(constructedForecastURL, {
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
        //ugh OWM 5day forecast returns every 3 hours per day based on current time, lots of items
        //so pulling just the 3pm timestamp item and its temp, wind & humidity
        //ex: 2021-07-30 03:00:00, 2021-07-30 06:00:00, 2021-07-30 09:00:00 
        //ex of 12noon timestamp: 2021-07-30 12:00:00
        //1st time number starts on 11th index so extract it starting there
        //console.log("3pm items: ");
        for(var i = 0; i < data.list.length; i++){
            var date = data.list[i].dt_txt.substring(11);
            var forecastTemp = data.list[i].main.temp;
            var forecastWind = data.list[i].wind.speed;
            var forecastHumidity = data.list[i].main.humidity;
            var forecastIcon = data.list[i].weather[0].icon;
            //if 3pm is found, extract temp, wind & humidity
            if (date.indexOf("03:00:00") > -1) {

                var forecastMomentDay = now.add(1, 'day').endOf('day').format("L");
                showForecastWeatherInfo(day, forecastMomentDay, forecastTemp, forecastWind, forecastHumidity, forecastIcon);
                
                //add objects to array/build for local storage
                forecastEntries.push({forecastCityName: properCapitalization, forecastDate: forecastMomentDay, forecastTemperature: forecastTemp, forecastWindSpeed: forecastWind, forecastHumidityPercentage: forecastHumidity, forecastWeatherImage: forecastIcon});

                //save in localstorage
                localStorage.setItem("forecastEntries", JSON.stringify(forecastEntries));
                day++;
            }
        }
    });

}

function showForecastWeatherInfo(forecastDay, forecastDate, forecastTempF, forecastWindMPH, forecastHumidityPerc, forecastIconNum) {

        var forecastDayHolder = $(".forecastDay" + forecastDay);
        forecastDayHolder.text(forecastDate);

        //https://openweathermap.org/img/wn/04n.png
        //icon value returned goes at end before .png
        var OWMiconURL = "https://openweathermap.org/img/wn/" + forecastIconNum + ".png";
        var forecastIconEl = $("<img>");
        forecastIconEl.attr("class", "card-text");
        forecastIconEl.attr("src", OWMiconURL);
        forecastIconEl.attr("width", "50px");
        forecastIconEl.attr("height", "50px");

        forecastDayHolder.append(forecastIconEl);

        var forecastInfoContainerEl = $(".forecastInfoContainer");
        var forecastTempFEl = $("<p>");
        forecastTempFEl.attr("class", "card-text");
        forecastTempFEl.text("Temp: " + forecastTempF + "°F");
        forecastDayHolder.append(forecastTempFEl);

        var forecastWindEl = $("<p>");
        forecastTempFEl.attr("class", "card-text");
        forecastWindEl.text("Wind: " + forecastWindMPH + " MPH");
        forecastDayHolder.append(forecastWindEl);

        var forecastHumidityEl = $("<p>");
        forecastTempFEl.attr("class", "card-text");
        forecastHumidityEl.text("Humidity: " + forecastHumidityPerc + " %");
        forecastDayHolder.append(forecastHumidityEl);

        //fix reset current day for next searches
        if (forecastDay === 5) {
            now = moment();
        };
}

function renderCities() {
    console.log("cities already saved");
}

function renderForecast() {
    console.log("forecast already saved");
}

function handleCities() {

    //retrieve key from local storage to see if it already exists 1st
    var lastcityEntries = JSON.parse(localStorage.getItem("cityEntries"));
    //if key does exist, render city weather else create array that'll get objects added to it when a search is conducted
    if (lastcityEntries !== null) {
        olCreated = true;
        renderCities();
    } else {
        olCreated = false;
        cityEntries = [];
        console.log("created cityEntries[] now");
    }

    handleForecast();


}

function handleForecast() {

    //retrieve key from local storage to see if it already exists 1st
    var lastforecastCityEntries = JSON.parse(localStorage.getItem("forecastEntries"));
    //if key does exist, render forecast else create array that'll get objects added to it when a search is conducted
    if (lastforecastCityEntries !== null) {
        olCreated = true;
        renderForecast();
    } else {
        olCreated = false;
        forecastEntries = [];
        console.log("created forecastEntries[] now");
    }

}

function init() {
    console.log("init called!")
    handleCities();
}

//USER INTERACTIONS ============================================================

//INITIALIZATION ===============================================================

searchCityBtn.on("click", function (event) {
    event.preventDefault();
    comboWords = "";
    weatherInfoContainerEl.empty();
    
    //console.log("save button " + event.target.id + " clicked");
    //console.log(event.currentTarget.parentNode.children[0].childNodes[0].textContent);
    var cityInput = $("#cityInput").val();
    console.log("cityInput: " + cityInput);
    searchCity(cityInput);
});


init();
