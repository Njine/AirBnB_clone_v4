$(document).ready(() => {
  const apiUrl = `http://${window.location.hostname}:5001/api/v1`;

  $.get(`${apiUrl}/status/`, (response) => {
    const apiStatus = $('DIV#api_status');
    if (response.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });

  $.ajax({
    url: `${apiUrl}/places_search/`,
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: (data) => {
      const placesSection = $('SECTION.places');
      data.forEach((place) => {
        const article = `<ARTICLE>
                          <DIV class="title">
                            <H2>${place.name}</H2>
                            <DIV class="price_by_night">
                              ${place.price_by_night}
                            </DIV>
                          </DIV>
                          <DIV class="information">
                            <DIV class="max_guest">
                              <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                              <BR />
                              ${place.max_guest} Guests
                            </DIV>
                            <DIV class="number_rooms">
                              <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                              <BR />
                              ${place.number_rooms} Bedrooms
                            </DIV>
                            <DIV class="number_bathrooms">
                              <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                              <BR />
                              ${place.number_bathrooms} Bathrooms
                            </DIV>
                          </DIV>
                          <DIV class="description">
                            ${place.description}
                          </DIV>
                        </ARTICLE>`;
        placesSection.append(article);
      });
    }
  });

  let amenities = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    const amenitiesH4 = $('.amenities H4');
    if (Object.values(amenities).length === 0) {
      amenitiesH4.html('&nbsp;');
    } else {
      amenitiesH4.text(Object.values(amenities).join(', '));
    }
  });
});
