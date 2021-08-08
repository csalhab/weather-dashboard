//DEPENDENCIES ================================================================
var searchCityBtn = $(".searchButton");

var olContainerEl = $(".vh-100");

var weatherInfoContainerEl = $(".weatherInfoContainer");

var weatherTop = $(".col-md-10");
weatherTop.css("visibility", "hidden");

var citiesSearchOnLeftDivEl = $("<div>");
citiesSearchOnLeftDivEl.attr("class", "citiesSearchedOnLeftDiv");

var olCreated;
var olEl = $("<ol>");

var isDynamicButton = false;

//DATA ========================================================================
var comboWords = "";
var properCapitalization;
var cityEntries = JSON.parse(localStorage.getItem("cityEntries"));
//[BUILD] call moment:
var now = moment();

//FUNCTIONS ===================================================================

function searchCity(userCityInput) {
  properCapitalization = handleLetterCasing(userCityInput);
  callOWM(properCapitalization);
}

function handleLetterCasing(origCityCasing) {
  words = origCityCasing.split(" ");
  //this handles capitalizing multiple words city name
  if (words.length > 1) {
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      if (i === words.length - 1) {
        //no ending space needed on the last word
        comboWords = comboWords + words[i];
      } else {
        //combine words separated with a space
        comboWords = comboWords + words[i] + " ";
      }
    }
    return comboWords;
  } else {
    //this handles capitalizing single word city name
    var lowerCaseCity = origCityCasing.toLowerCase();
    var initialLetterUpperCase = origCityCasing.charAt(0).toUpperCase();
    var initialUpperCaseCity = initialLetterUpperCase + lowerCaseCity.slice(1);
    return initialUpperCaseCity;
  }
}

async function callOWM(cityInputForOWM) {
  var baseURL = "https://api.openweathermap.org/data/2.5/weather";
  var addCity = "q=";
  var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
  //https://openweathermap.org/current#data
  //For temperature in Fahrenheit use units=imperial
  var units = "units=imperial";
  //http://api.openweathermap.org/data/2.5/weather?q=Miami&appid=aa772c06902f60c4e5f5e833c0ce31f4
  var constructedWeatherURL =
    baseURL + "?" + addCity + cityInputForOWM + "&" + units + "&" + addAPIKey;

  var data = await fetch(constructedWeatherURL, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  }).then(function (response) {
    return response.json();
  });
  if (data.cod === "404") {
    console.log("badSearchTerm 404 & handled");
    alert("Please make sure you entered a valid city name.");
  } else {
    if (!isDynamicButton) {
      saveCity(cityInputForOWM);
      showCity(cityInputForOWM);
    }
    extractAndShowWeatherInfo(data, cityInputForOWM);
    callOWMForecast(cityInputForOWM);
  }
}

function saveCity(cityInputStore) {
  if (cityEntries === null) {
    cityEntries = [];
  }
  //add objects to array/build for local storage
  cityEntries.push({ cityName: cityInputStore });
  //save in localstorage
  localStorage.setItem("cityEntries", JSON.stringify(cityEntries));
}

function showCity(cityInputShow) {
  if (!olCreated || cityEntries !== null) {
    olContainerEl.append(citiesSearchOnLeftDivEl);
    olCreated = true;
  }

  //lists of cities on the left side
  var cityBtnEl = $("<button>");
  cityBtnEl.attr("class", "citySearchedOnLeft btn btn-secondary col-12");
  cityBtnEl.attr("data-city", cityInputShow);
  cityBtnEl.text(cityInputShow);
  citiesSearchOnLeftDivEl.append(cityBtnEl);
}

function extractAndShowWeatherInfo(OWMdata, city) {
  //simplified now into a variable to store
  var formattedDate = "(" + now.format("L") + ")";

  var iconURL =
    "https://openweathermap.org/img/wn/" + OWMdata.weather[0].icon + ".png";

  weatherInfoContainerEl.empty();

  var cityDateIcon = $(".cityDateIconContainer");

  cityDateIcon.text(city + " " + formattedDate);

  var weatherIconEl = $("<img>");
  weatherIconEl.attr("src", iconURL);
  weatherIconEl.attr("width", "50px");
  weatherIconEl.attr("height", "50px");
  cityDateIcon.append(weatherIconEl);

  var tempFEl = $("<p>");
  tempFEl.text("Temp: " + OWMdata.main.temp + "°F");
  weatherInfoContainerEl.append(tempFEl);

  var windEl = $("<p>");
  windEl.text("Wind: " + OWMdata.wind.speed + " MPH");
  weatherInfoContainerEl.append(windEl);

  var humidityEl = $("<p>");
  humidityEl.text("Humidity: " + OWMdata.main.humidity + " %");
  weatherInfoContainerEl.append(humidityEl);

  weatherTop.css("visibility", "visible");
}

async function callOWMForecast(cityInputForOWMForecast) {
  var baseURL = "https://api.openweathermap.org/data/2.5/forecast";
  var addCity = "q=";
  //https://openweathermap.org/current#data
  //For temperature in Fahrenheit use units=imperial
  var units = "units=imperial";
  var addAPIKey = "appid=aa772c06902f60c4e5f5e833c0ce31f4";
  //Example URL http://api.openweathermap.org/data/2.5/forecast?q=Miami&units=imperial&appid=aa772c06902f60c4e5f5e833c0ce31f4
  var constructedForecastURL =
    baseURL +
    "?" +
    addCity +
    cityInputForOWMForecast +
    "&" +
    units +
    "&" +
    addAPIKey;

  var data = await fetch(constructedForecastURL, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  }).then(function (response) {
    return response.json();
  });

  extractAndShowForecast(data);
}

function extractAndShowForecast(OWMForecastData) {
  var day = 1;
  for (var i = 0; i < OWMForecastData.list.length; i++) {
    //ugh OWM 5day forecast returns every 3 hours per day based on current time, lots of items
    //so pulling just the 3pm timestamp item and its temp, wind & humidity
    //ex: 3pm is 15:00:00!!!
    //ex: 2021-07-30 03:00:00, 2021-07-30 06:00:00, 2021-07-30 09:00:00
    //ex of 12noon timestamp: 2021-07-30 12:00:00
    //ex of 6pm timestamp: 2021-07-30 18:00:00
    //1st time number starts on 11th string index so extract it starting there
    var date = OWMForecastData.list[i].dt_txt.substring(11);
    //if 3pm is found, extract temp, wind & humidity
    if (date.indexOf("15:00:00") > -1) {
      var forecastTemp = OWMForecastData.list[i].main.temp;
      var forecastWind = OWMForecastData.list[i].wind.speed;
      var forecastHumidity = OWMForecastData.list[i].main.humidity;
      var forecastIcon = OWMForecastData.list[i].weather[0].icon;

      var forecastDayHolder = $(".forecastDay" + day);
      forecastDayHolder.text(now.add(1, "day").endOf("day").format("L"));

      //https://openweathermap.org/img/wn/04n.png
      //icon value returned goes at end before .png
      var OWMiconURL =
        "https://openweathermap.org/img/wn/" + forecastIcon + ".png";
      var forecastIconEl = $("<img>");
      forecastIconEl.attr("class", "card-text");
      forecastIconEl.attr("src", OWMiconURL);
      forecastIconEl.attr("width", "50px");
      forecastIconEl.attr("height", "50px");

      forecastDayHolder.append(forecastIconEl);

      var forecastTempFEl = $("<p>");
      forecastTempFEl.attr("class", "card-text");
      forecastTempFEl.text("Temp: " + forecastTemp + "°F");
      forecastDayHolder.append(forecastTempFEl);

      var forecastWindEl = $("<p>");
      forecastTempFEl.attr("class", "card-text");
      forecastWindEl.text("Wind: " + forecastWind + " MPH");
      forecastDayHolder.append(forecastWindEl);

      var forecastHumidityEl = $("<p>");
      forecastTempFEl.attr("class", "card-text");
      forecastHumidityEl.text("Humidity: " + forecastHumidity + " %");
      forecastDayHolder.append(forecastHumidityEl);

      day++;
    }
    //reset current day, which had the add above, for next searches
    if (day === 6) {
      now = moment();
    }
  }
}

function init() {
  if (cityEntries !== null) {
    for (var i = 0; i < cityEntries.length; i++) {
      showCity(cityEntries[i].cityName);
    }
  }
}
//USER INTERACTIONS ============================================================

// Delegate event listener to the parent element, <div class="vh-100">
olContainerEl.on("click", ".citySearchedOnLeft", function (event) {
  //console.log($(event.target).attr("data-city"));
  isDynamicButton = true;
  callOWM($(event.target).attr("data-city"));
});

searchCityBtn.on("click", function (event) {
  event.preventDefault();

  isDynamicButton = false;
  comboWords = "";

  var cityInput = $("#cityInput").val();

  if (!cityInput) {
    alert("You must enter a city to be able to search for its weather.");
  } else {
    searchCity(cityInput);
  }
});

//INITIALIZATION ==============================================================

init();
