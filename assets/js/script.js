$(document).ready(function() {
  // "166a433c57516f51dfab1f7edaed8413" api key
  const API_KEY = "166a433c57516f51dfab1f7edaed8413";


  let d = "12/26/1991";
  let temp = 76.3;
  let humidity = 42;

  $("#test").append(weatherCard(d,temp,humidity));


  /**************************************** Find City Function ****************************************/

  // searchInput = string
  function findCity(searchInput) {
    if (searchInput != "") {
      let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(res) {
        console.log(res.cod);
        // cod 200 means that the search is a hit
        if(res.cod === 200) {
          $("#search-input").removeClass("border border-danger");
          $("#search-input-error").addClass("d-none");
        }
      }, function(res) {
        $("#search-input").addClass("border border-danger");
        $("#search-input-error").removeClass("d-none");
      });
    }
  }



  function weatherCard(date, temp, humidity) {
    let card = $("<div>").addClass("card");

    let cardHeader = $("<div>").addClass("card-header bg-primary text-white");
    card.append(cardHeader.text(date));


    let cardBody = $("<div>").addClass("card-body");
    
    let cardTitle = $("<div>").addClass("card-title");
    cardBody.append(cardTitle.text(`Temp: ${temp}°F`));

    let cardText = $("<div>").addClass("card-text");
    cardBody.append(cardText.text(`Humidity: ${humidity}%`));

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
