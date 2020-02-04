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


  /**************************************** Find City Function ****************************************/

  // searchInput = string
  function findCity(searchInput) {
    if (searchInput != "") {
      if($("#country-select").val() != "Country (Optional)") {
        searchInput += `, ${$("#country-select").val()}`;
      }

      let todayQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`;
      let sixdayQueryURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${searchInput}&cnt=7&appid=${API_KEY}`;
      $.ajax({
        url: sixdayQueryURL,
        method: "GET"
      }).then(function(res) {
        console.log(res);

        addToday(res);
        addSixDay(res);
        // cod 200 means that the search is a hit
        if(res.cod === 200) {
          $("#search").removeClass("border border-danger");
          $("#search-input-error").addClass("d-none");
        }
      }, function(res) {
        $("#search").addClass("border border-danger");
        $("#search-input-error").removeClass("d-none");
        $("#search-input").val("");
        $("#country-select").val("Country (Optional)");
      });
    }
  }

  function addToday(res) {
    // Add Today's weather
    let todayTitle = $("<h4>");
    todayTitle.text(`${res.city.name}, ${res.city.country} (${moment(res.list[0].dt * 1000).format("MM/DD/YYYY h:MM A")})`)
    $("#today-forecast").append(todayTitle);

    let todayTemp = $("<p>").addClass("lead");
    todayTemp.text(`Temperature: ${toF(res.list[0].temp.day)}°F`);
    $("#today-forecast").append(todayTemp);

    let todayHumidity = $("<p>").addClass("lead");
    todayHumidity.text(`Humidity: ${res.list[0].humidity}%`);
    $("#today-forecast").append(todayHumidity);

    let todayWind = $("<p>").addClass("lead");
    todayWind.text(`Wind Speed: ${res.list[0].speed} MPH`);
    $("#today-forecast").append(todayWind);

  }

  function addSixDay(res) {
    console.log(res);
    // Add city name and country
    $("#6day-forecast").text(`${res.city.name}, ${res.city.country} `);

    for(let i = 1; i < 7; i++) {
      let d = moment(res.list[i].dt * 1000).format("MM/DD/YYYY");
      let t = toF(res.list[i].temp.day);
      let h = res.list[i].humidity;
      $(`#day${i}`).append(weatherCard(d,t,h))
    }
  }

  function toF(Kel) {
    return Number((Kel - 273.15) * 1.8 + 32).toFixed(1);
  }

  function addSearchResult(name, code) {
    // ************************ If the city is already on the list?

    // Remove active attribute from the current city
    $(".active").removeClass("active");


    let button = $("<button>").addClass("list-group-item list-group-item-action active");
    button.attr("data-city", name);
    button.attr("data-country", code);
    button.text(`${name}, ${code}`);

    $("#city-list").append(button);
  }

  function weatherCard(date, temp, humidity) {
    let card = $("<div>").addClass("card");

    let cardHeader = $("<div>").addClass("card-header bg-primary text-white");
    card.append(cardHeader.text(date));


    let cardBody = $("<div>").addClass("card-body");

    let cardIcon = $("<div>").addClass("card-title");
    let faIcon = $("<i>").addClass("fas fa-cloud-showers-heavy fa-3x");
    cardBody.append(cardIcon.append(faIcon));
    
    
    let cardTemp = $("<div>").addClass("card-text");
    cardBody.append(cardTemp.text(`Temp: ${temp}°F`));

    let cardHumidity = $("<div>").addClass("card-text");
    cardBody.append(cardHumidity.text(`Humidity: ${humidity}%`));

    card.append(cardBody);

    return card;
  }

  /******************************************* Event Listeners *******************************************/
  $("#find-city").on("click", function(event) {
    event.preventDefault();

    let searchInput = $("#search-input").val();
    findCity(searchInput);
  });

  $(document).on("keydown", function(event) {
    if (event.which === 13 && $("#search-input").val() != ""){
      findCity($("#search-input").val());
    }
  });

  $(".list-group-item").on("click", function(event) {
    console.log($(this).attr("data-city"));
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
});


