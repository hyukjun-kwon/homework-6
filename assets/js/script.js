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

  
  let d = "12/26/1991";
  let temp = 76.3;
  let humidity = 42;

  $("#test1").append(weatherCard(d,temp,humidity));
  $("#test2").append(weatherCard(d,temp,humidity));
  $("#test3").append(weatherCard(d,temp,humidity));
  $("#test4").append(weatherCard(d,temp,humidity));
  $("#test5").append(weatherCard(d,temp,humidity));
  $("#test6").append(weatherCard(d,temp,humidity));


  /**************************************** Find City Function ****************************************/

  // searchInput = string
  function findCity(searchInput) {
    if (searchInput != "") {
      if($("#country-select").val() != "Country (Optional)") {
        searchInput += `, ${$("#country-select").val()}`;
      }

      let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(res) {
        console.log(res);
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



  function weatherCard(date, temp, humidity) {
    let card = $("<div>").addClass("card");

    let cardHeader = $("<div>").addClass("card-header bg-primary text-white");
    card.append(cardHeader.text(date));


    let cardBody = $("<div>").addClass("card-body");

    let cardIcon = $("<div>").addClass("card-title");
    let faIcon = $("<i>").addClass("fas fa-cloud-showers-heavy fa-5x fa-fw");
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


