
$('#rover_view').hide();
$('#rover_nav').hide();

var currentPhoto;
var camButtons = [];

var curiosity = 'Curiosity';
var opportunity = 'Opportunity';
var spirit = 'Spirit';

var sol = 0;


var photoURL = '/api/photos/';
var roverURL = '/api/rovers/';
// var cameraURL = '/api/camera/'

// GET THE ROVER FROM DAY 1
$('#Opportunity').on('click', function(e){
    e.preventDefault();
    getRover(roverURL, 'Opportunity');
})

// GET THE ROVER FROM DAY 1
$('#Curiosity').on('click', function(e){
    e.preventDefault();
    getRover(roverURL, 'Curiosity');
})

// GET THE ROVER FROM DAY 1
$('#Spirit').on('click', function(e){
    e.preventDefault();
    getRover(roverURL, 'Spirit');
})



function getRover(url, rover) {
    $.ajax({
        url: url + rover,
        type: 'GET',
        dataType: 'json',
        success: function(response){

            var concurrentArray = []
            var conArray = []

            $('#home_slider').hide();

            $('#rover_nav').show();
            $('#home_nav').hide();

            $('#main_home').hide();
            $('#rover_view').show();

            $('#main-photo').attr('src', response.img_src);

            $('#rover_name').text('Rover: ' + rover);
            $('#camera_name').text('Camera: ' + response.camera.full_name);
            $('#sol_date').text('Sol Date: ' + response.sol);
            $('#earth_date').text('Earth Date: ' + response.earth_date);
            
            $(document).ready(function () {
                window.scrollTo(0,0);
            });

            for (var i = 0; i < response.concurrent.length; i++) {
                $('#concur_container').append('<h3 class="diff_camera">' + response.concurrent[i].camera.full_name + '</h3>')
                if (response.concurrent[i].img_src === 'notreal.jpg') {
                    $('#concur_container').append('<img src="/static/img/null_rover.jpg" class="concurrent_img">');
                    $('#concur_container').append('<button type="button" name="button" id="cam_button_' + i + '" class="button-primary col-xs-3 col-md-6 col-sm-12">Switch Camera</button>');

                } else {
                    $('#concur_container').append('<img class="' + i + '" src="' + response.concurrent[i].img_src + '" class="concurrent_img"></a>');
                    $('#concur_container').append('<button type="button" name="button" id="cam_button_' + i + '" class="button-primary col-xs-3 col-md-6 col-sm-12">Switch Camera</button>');
                }
                camButtons.push(i);
            }
            currentPhoto = response;

            for (var i = 0; i < camButtons.length; i++) {
                (function(i) {
                    $('#cam_button_' + camButtons[i]).on('click', function() {
                        console.log(i);
                        fetchPhotos(response.concurrent[i].url)
                    })
                })(i);
            }
        }
    });
};




// AJAX CALL TO THE PHOTOS
function fetchPhotos(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(response){
            // if (response.next_photo === null || response.prev_photo === null) {
            //     $('#main-photo').attr('src', '/static/img/null_rover.jpg');
            // } else {
            $('#main-photo').attr('src', response.img_src);
            // }
            $('#camera_name').text('Camera: ' + response.camera.full_name);
            $('#sol_date').text('Sol Date: ' + response.sol);
            $('#earth_date').text('Earth Date: ' + response.earth_date);

            $('.diff_camera').remove();
            $('.concurrent_img').remove();
            for (var i = 0; i < response.concurrent.length; i++) {
                $('#cam_button_' + i).remove();
                $('.' + i).remove();
            }

            $(document).ready(function () {
                window.scrollTo(0,0);
            });

            for (var i = 0; i < response.concurrent.length; i++) {
                $('#concur_container').append('<h3 class="diff_camera">' + response.concurrent[i].camera.full_name + '</h3>')
                if (response.concurrent[i].img_src === 'notreal.jpg') {
                    $('#concur_container').append('<img src="/static/img/null_rover.jpg" class="concurrent_img">');
                    $('#concur_container').append('<button type="button" name="button" id="cam_button_' + i + '" class="button-primary col-xs-3 col-md-6 col-sm-12">Switch Camera</button>');

                } else {
                    $('#concur_container').append('<img class="' + i + '" src="' + response.concurrent[i].img_src + '" class="concurrent_img"></a>');
                    $('#concur_container').append('<button type="button" name="button" id="cam_button_' + i + '" class="button-primary col-xs-3 col-md-6 col-sm-12">Switch Camera</button>');
                }
                camButtons.push(i);
            }
            currentPhoto = response;

            for (var i = 0; i < camButtons.length; i++) {
                (function(i) {
                    $('#cam_button_' + camButtons[i]).on('click', function() {
                        fetchPhotos(response.concurrent[i].url);
                    });
                })(i);
            }        
        }
    });
}

// fetchPhotos(photoURL)

// GET THE NEXT PHOTO
function nextPhoto() {
	$('#main-photo').attr('src', currentPhoto.next_photo.img_src);
    fetchPhotos(currentPhoto.next_photo.url);
};

$('#next-photo').on('click', function(){
	nextPhoto();
});


// GET THE PREVIOUS PHOTO
function prevPhoto() {
	$('#main-photo').attr('src', currentPhoto.prev_photo.img_src);
    fetchPhotos(currentPhoto.prev_photo.url);
};


$('#prev-photo').on('click', function(){
	prevPhoto();
});




// FETCH THE ROVER
function fetchRover(url, rover) {
    $.ajax({
        url: url + rover,
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	$('#main-photo').attr('src', response.img_src);

        }
    });
}




function fetchRoverBySol(url, rover, sol, cam) {
    $.ajax({
        url: url + rover
        	 + '?sol=' + sol 
        	 + '&camera__name=' + cam, 
        type: 'GET',
        dataType: 'json',
        success: function(response){
            if (response.next_photo === null) {
                $('#main-photo').attr('src', '/static/img/null_rover.jpg');
            } else {
                $('#main-photo').attr('src', response.img_src);
            }
            $('#sol_date').text('Sol Date: ' + response.sol);
            $('#earth_date').text('Earth Date: ' + response.earth_date);
        	currentPhoto = response;

        }
    });
}

$('#next-sol').on('click', function(){
	fetchRoverBySol(roverURL, opportunity, (currentPhoto.sol + 1), currentPhoto.camera.name);
})

$('#prev-sol').on('click', function(){
	fetchRoverBySol(roverURL, opportunity, (currentPhoto.sol - 1), currentPhoto.camera.name);
})

$('#submit_sol').on('click', function(e){
	e.preventDefault();
	var soles = document.getElementById('sol');
	new_sol = soles.elements[0].value;
	fetchBySol(roverURL, opportunity, new_sol, currentPhoto.camera.name);
});




function fetchBySol(url, rover, sol, cam) {
	$.ajax({
        url: url + rover
        	 + '?sol=' + sol 
        	 + '&camera__name=' + cam, 
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	if (response.img_src === 'notreal.jpg') {
                $('#main-photo').attr('src', '/static/img/null_rover.jpg');
            } else {
                $('#main-photo').attr('src', response.img_src);
            }
            $('#sol_date').text('Sol Date: ' + response.sol);
            $('#earth_date').text('Earth Date: ' + response.earth_date);
        	currentPhoto = response;
        	// SolInfo.loadall(response);
        	// buildSolInfo();
        }
    });	
}




