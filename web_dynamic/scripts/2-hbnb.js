$(document).ready(function() {
  $.get('http://0.0.0.0:5001/api/v1/status/')
    .done(function(response) {
      if (response.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    })
    .fail(function(error) {
      console.error('Error fetching the API status', error);
    });
});