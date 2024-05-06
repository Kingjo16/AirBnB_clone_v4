$(document).ready(function() {
  const amenityIds = {};
  const locationIds = {};

  function updateAmenitiesList() {
    $('input[type="checkbox"][data-type="amenity"]').on('change', function() {
      const amenityId = $(this).data('id');
      const amenityName = $(this).data('name');

      if (this.checked) {
        amenityIds[amenityId] = amenityName;
      } else {
        delete amenityIds[amenityId];
      }

      updateLocationsList();
    });
  }

  function updateLocationsList() {
    $('input[type="checkbox"][data-type="location"]').on('change', function() {
      const locationId = $(this).data('id');
      const locationName = $(this).data('name');
      const locationType = $(this).data('location-type');

      if (this.checked) {
        locationIds[locationType] = locationIds[locationType] || {};
        locationIds[locationType][locationId] = locationName;
      } else {
        delete locationIds[locationType][locationId];
        if (Object.keys(locationIds[locationType]).length === 0) {
          delete locationIds[locationType];
        }
      }

      let locationList = Object.values(locationIds)
        .flatMap(Object.values)
        .join(', ');

      $('.locations h4').text(locationList);
    });
  }

  function sendPlacesSearchRequest() {
    const apiUrl = 'http://0.0.0.0:5001/api/v1/places_search/';

    $.ajax({
      type: 'POST',
      url: apiUrl,
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(locationIds['state'] || {}),
        cities: Object.keys(locationIds['city'] || {})
      }),
      success: handlePlacesResponse,
      error: handleError
    });
  }

  function handlePlacesResponse(response) {
    const placesSection = $('section.places');
    placesSection.empty();

    response.forEach(place => {
      const article = $('<article>').html(`
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">
            ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
          </div>
          <div class="number_rooms">
            ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
          </div>
          <div class="number_bathrooms">
            ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
          </div>
        </div>
        <div class="description">${place.description}</div>
        <div class="reviews hide">
          <h2>Reviews</h2>
          <span class="toggle-reviews">Hide</span>
          <ul></ul>
        </div>
      `);

      const reviewsButton = article.find('.toggle-reviews');
      reviewsButton.click(() => {
        toggleReviews(article);
      });

      placesSection.append(article);
    });
  }

  function toggleReviews(article) {
    const reviewsDiv = article.find('.reviews');
    const reviewsList = reviewsDiv.find('ul');
    const reviewsButton = reviewsDiv.find('.toggle-reviews');

    if (reviewsDiv.hasClass('hide')) {
      const placeId = article.attr('data-id');
      const apiUrl = `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`;

      $.ajax({
        type: 'GET',
        url: apiUrl,
        success: function(response) {
          reviewsList.empty();

          response.forEach(review => {
            const reviewItem = $('<li>').text(review.text);
            reviewsList.append(reviewItem);
          });

          reviewsDiv.removeClass('hide');
          reviewsButton.text('Hide');
        },
        error: function(error) {
          console.error('Error fetching reviews:', error);
        }
      });
    } else {
      reviewsList.empty();
      reviewsDiv.addClass('hide');
      reviewsButton.text('Show');
    }
  }

  function handleError(error) {
    console.error('Error fetching places:', error);
  }

  updateAmenitiesList();

  $('button').click(() => {
    sendPlacesSearchRequest();
  });
});