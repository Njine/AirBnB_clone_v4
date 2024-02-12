// Script executed only when DOM is loaded with jQuery

$(document).ready(function () {
    // Object to store checked checkboxes
    let checkedBoxes = {};

    // Checkbox change event handler
    $('input:checkbox').change(function () {
        if ($(this).is(':checked')) {
            checkedBoxes[$(this).data('id')] = $(this).data('name');
        } else {
            delete checkedBoxes[$(this).data('id')];
        }

        // Update amenities display
        $('div.amenities h4').html(function () {
            let amenities = Object.values(checkedBoxes);
            return amenities.length === 0 ? '&nbsp;' : amenities.join(', ');
        });
    });

    // API status request
    const apiStatus = $('DIV#api_status');
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        success: function (data) {
            if (data.status === 'OK') {
                apiStatus.addClass('available');
            } else {
                apiStatus.removeClass('available');
            }
        }
    });

    // Button click event to search places
    $('button').click(function () {
        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: '{}',
            success: function (data) {
                // Append each place to the places section
                for (let currentPlace of data) {
                    $('.places').append('<article> <div class="title"> <h2>' + currentPlace.name + '</h2><div class="price_by_night">' + '$' + currentPlace.price_by_night + '</div></div> <div class="information"> <div class="max_guest"> <i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + currentPlace.max_guest + ' Guests</div><div class="number_rooms"> <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + currentPlace.number_rooms + ' Bedrooms</div><div class="number_bathrooms"> <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + currentPlace.number_bathrooms + ' Bathroom </div></div> <div class="user"></div><div class="description">' + '$' + currentPlace.description + '</div></article>');
                }
            }
        });
    });
});
