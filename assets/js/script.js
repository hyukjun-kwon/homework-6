$(document).ready(function() {
  // "166a433c57516f51dfab1f7edaed8413" api key
  const API_KEY = "166a433c57516f51dfab1f7edaed8413";

  // Build country selection from country.js
  COUNTRY.forEach(item => {
    let option = $("<option>");
    option.attr("value", item.code);
    option.text(item.name);
    $("#country-select").append(option);
  });

  // Default page = New York City
  makeQuery("New York City");

  /********************************************************* AJAX Query Function *********************************************************/

  function makeQuery(searchInput) {
    if (searchInput != "") {
      // if user selects country, concat to query string
      if ($("#country-select").val() != "Country (Optional)") {
        searchInput += `, ${$("#country-select").val()}`;
      }

      // DAILY weather forecast query, COUNT=7 (today + 6 more days)
      let queryURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${searchInput}&cnt=7&appid=${API_KEY}`;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(
        // If response is valid
        function(res) {
          console.log(res);
          addToday(res);
          addSixDay(res);
          addSearchResult(res);

          $("#search").removeClass("border border-danger");
          $("#search-input-error").addClass("d-none");
        },
        // If search fails (City does not exist)
        function(res) {
          // Create red border and show error message
          $("#search").addClass("border border-danger");
          $("#search-input-error").removeClass("d-none");
          // Clear the search bar, and reset the country selection
          $("#search-input").val("");
          $("#country-select").val("Country (Optional)");
        }
      );
    }
  }

  /*********************************************************** Display Forecasts ***********************************************************/

  function addToday(res) {
    // Empty the today's weather section
    $("#today-forecast").empty();

    // Create Today's weather components
    let todayTitle = $("<h4>");
    todayTitle.text(
      `${res.city.name}, ${res.city.country} (${moment(
        res.list[0].dt * 1000
      ).format("MM/DD/YYYY")})`
    );

    let todayTemp = $("<p>").addClass("lead");
    todayTemp.text(`Temperature: ${toF(res.list[0].temp.day)}°F`);

    let todayHumidity = $("<p>").addClass("lead");
    todayHumidity.text(`Humidity: ${res.list[0].humidity}%`);

    let todayWind = $("<p>").addClass("lead");
    todayWind.text(`Wind Speed: ${res.list[0].speed} MPH`);

    // Append
    $("#today-forecast").append(
      todayTitle,
      todayTemp,
      todayHumidity,
      todayWind
    );
  }

  function addSixDay(res) {
    // Add city name and country
    $("#6day-forecast").html(`${res.city.name}, ${res.city.country} `);

    for (let i = 1; i < 7; i++) {
      let d = moment(res.list[i].dt * 1000).format("MM/DD/YYYY");
      let t = toF(res.list[i].temp.day);
      let h = res.list[i].humidity;
      let ic = res.list[i].weather[0].icon;

      $(`#day${i}`).html(weatherCard(d, t, h, ic));
    }
  }

  /******************************************************** City list Manipulation ********************************************************/
  function addSearchResult(res) {
    let name = res.city.name;
    let code = res.city.country;

    // Remove active attribute from the current "active" city
    $(".active").removeClass("active");

    // If city already exists on the list, "activate" the city and return
    for (let i = 0; i < $(".list-group-item").length; i++) {
      if (
        $(".list-group-item")[i].getAttribute("id") === name &&
        $(".list-group-item")[i].getAttribute("data-country") === code
      ) {
        $(`.list-group-item[id="${name}"]`).addClass("active");
        return;
      }
    }

    // If city does not exist, create & add to the list
    let button = $("<button>").addClass(
      "list-group-item list-group-item-action active mb-1"
    );
    button.attr("id", name);
    button.attr("data-country", code);
    button.text(`${name}, ${code}`);

    $("#city-list").append(button);
  }

  /********************************************************* Utility Functions *********************************************************/

  // Temperature conversion from Kelvins to Fahrenheits
  function toF(Kel) {
    return Number((Kel - 273.15) * 1.8 + 32).toFixed(1);
  }

  // Create weather card for six-day forecast
  // All parameters are strings
  function weatherCard(date, temp, humidity, weather_icon) {
    let card = $("<div>").addClass("card mb-2");

    let cardHeader = $("<div>").addClass("card-header bg-primary text-white");
    card.append(cardHeader.text(date));

    let cardBody = $("<div>").addClass("card-body");

    let cardIcon = $("<div>").addClass("card-title");
    let faIcon = $("<i>");
    switch (weather_icon) {
      // clear sky
      case "01d":
      case "01n":
        faIcon.addClass("fas fa-sun fa-3x");
        break;
      // few clouds
      case "02d":
      case "02n":
      // scattered clouds
      case "03d":
      case "03n":
      // broken clouds
      case "04d":
      case "04n":
        faIcon.addClass("fas fa-cloud-sun fa-3x");
        break;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        faIcon.addClass("fas fa-cloud-showers-heavy fa-3x");
        break;
      case "11d":
      case "11n":
        faIcon.addClass("fas fa-thunderstorm fa-3x");
        break;
      case "13d":
      case "13n":
        faIcon.addClass("fas fa-snowflake fa-3x");
        break;
      case "50d":
      case "50n":
        faIcon.addClass("fas fa-fog fa-3x");
        break;
    }
    cardBody.append(cardIcon.append(faIcon));

    let cardTemp = $("<div>").addClass("card-text");
    cardBody.append(cardTemp.text(`Temp: ${temp}°F`));

    let cardHumidity = $("<div>").addClass("card-text");
    cardBody.append(cardHumidity.text(`Humidity: ${humidity}%`));

    card.append(cardBody);

    return card;
  }

  /********************************************************* Event Listeners *********************************************************/
  $("#find-city").on("click", function(event) {
    event.preventDefault();

    if ($("#search-input").val() != "") {
      let searchInput = $("#search-input").val();
      if ($("#country-select").val() != "Country (Optional)") {
        searchInput += `, ${$("#country-select").val()}`;
      }
      makeQuery(searchInput);
    }
  });

  $(document).on("keydown", function(event) {
    if (event.which === 13 && $("#search-input").val() != "") {
      let searchInput = $("#search-input").val();
      if ($("#country-select").val() != "Country (Optional)") {
        searchInput += `, ${$("#country-select").val()}`;
      }
      makeQuery(searchInput);
    }
  });

  $(".list-group-item").on("click", function(event) {
    $(".active").removeClass("active");
    $(this).addClass("active");
    makeQuery(`${$(this).attr("id")}, ${$(this).attr("data-country")}`);
  });
});
