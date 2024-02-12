$(document).ready(function () {
  const api = 'http://' + window.location.hostname;

  // Retrieve API status
  $.get(api + ':5001:/api/v1/status/', function (response) {
    const apiStatus = response.status === 'OK' ? 'available' : '';
    $('#api_status').toggleClass('available', apiStatus === 'available');
  });

  // Fetch places data on page load
  fetchPlacesData();

  // Event listeners for checkboxes
  $('.locations > UL > H2 > INPUT[type="checkbox"]').change(updateLocations);
  $('.locations > UL > UL > LI INPUT[type="checkbox"]').change(updateLocations);
  $('.amenities INPUT[type="checkbox"]').change(updateAmenities);

  // Event listener for search button
  $('BUTTON').click(searchPlaces);
});

// Function to update locations based on checkbox changes
function updateLocations () {
  const states = $('.locations > UL > H2 > INPUT[type="checkbox"]:checked').map(function () {
    return { [$(this).attr('data-id')]: $(this).attr('data-name') };
  }).get();

  const cities = $('.locations > UL > UL > LI INPUT[type="checkbox"]:checked').map(function () {
    return { [$(this).attr('data-id')]: $(this).attr('data-name') };
  }).get();

  const locations = Object.assign({}, ...states, ...cities);
  updateLocationHeader(locations, '.locations');
}

// Function to update amenities based on checkbox changes
function updateAmenities () {
  const amenities = $('.amenities INPUT[type="checkbox"]:checked').map(function () {
    return { [$(this).attr('data-id')]: $(this).attr('data-name') };
  }).get();

  updateLocationHeader(Object.assign({}, ...amenities), '.amenities');
}

// Function to update location header text
function updateLocationHeader (locations, headerSelector) {
  const headerText = Object.values(locations).join(', ') || '&nbsp;';
  $(headerSelector + ' H4').html(headerText);
}

// Function to fetch places data
function fetchPlacesData () {
  $.ajax({
    url: api + ':5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: appendPlaces
  });
}

// Function to search places based on selected filters
function searchPlaces () {
  const states = getSelectedValues('.locations > UL > H2 > INPUT[type="checkbox"]');
  const cities = getSelectedValues('.locations > UL > UL > LI INPUT[type="checkbox"]');
  const amenities = getSelectedValues('.amenities INPUT[type="checkbox"]');

  $.ajax({
    url: api + ':5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({ states, cities, amenities }),
    contentType: 'application/json',
    dataType: 'json',
    success: appendPlaces
  });
}

// Function to get selected values from checkboxes
function getSelectedValues (selector) {
  return $(selector + ':checked').map(function () {
    return $(this).attr('data-id');
  }).get();
}

// Function to append places data to the DOM
function appendPlaces (data) {
  const placesSection = $('SECTION.places');
  placesSection.empty();
  placesSection.append(data.map(function (place) {
    return `<ARTICLE>
              <DIV class="title">
                <H2>${place.name}</H2>
                <DIV class="price_by_night">
                  ${place.price_by_night}
                </DIV>
              </DIV>
              <DIV class="information">
                <DIV class="max_guest">
                  <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                  </BR>
                  ${place.max_guest} Guests
                </DIV>
                <DIV class="number_rooms">
                  <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                  </BR>
                  ${place.number_rooms} Bedrooms
                </DIV>
                <DIV class="number_bathrooms">
                  <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                  </BR>
                  ${place.number_bathrooms} Bathrooms
                </DIV>
              </DIV>
              <DIV class="description">
                ${place.description}
              </DIV>
            </ARTICLE>`;
  }));
}
