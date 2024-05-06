$(document).ready(function() {
  function fetchPlaces() {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({})
    })
      .done(function(response) {
        response.forEach(function(place) {
          const article = `<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">
                <i class="fa fa-users fa-3x" aria-hidden="true"></i><br>
                ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
              </div>
              <div class="number_rooms">
                <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>
                ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
              </div>
              <div class="number_bathrooms">
                <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>
                ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
              </div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`;

          $('.places').append(article);
        });
      })
      .fail(function(error) {
        console.error('Error fetching places:', error);
      });
  }

  fetchPlaces();
});