

// $('article.rover-info').hide();
// $('.rover-info').removeClass('hidden')

// $('.map-loc').hover(function(){
//     $('.welcome').hide();
// 	$('article[rover-lower="' + $(this).attr('id') + '"]').fadeIn(200);
// 	console.log($(this).attr('id'));
// }, function(){
// 	$('article.rover-info').hide();
// 	$('.welcome').fadeIn(200);
// })

var currentPhoto;

var curiosity = '5';
var oppurtunity = '6';
var spirit = '7';

var sol = 0;


var photoURL = '/api/photos/267550';
var roverURL = '/api/rovers/';
// var cameraURL = '/api/camera/'

// AJAX CALL TO THE PHOTOS
function fetchPhotos(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	console.log(response)
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response
        }
    });
}

fetchPhotos(photoURL)

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


function fetchRover(url, rover) {
    $.ajax({
        url: url + rover,
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	console.log(response);
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        }
    });
}


// fetchRover(roverURL, curiosity);



function fetchRoverBySol(url, rover, sol, cam) {
    $.ajax({
        url: url + rover
        	 + '?sol=' + sol 
        	 + '&camera__name=' + cam, 
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	console.log(url, rover, sol, cam)
        	console.log(response);
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        }
    });
}

$('#next-sol').on('click', function(){
	fetchRoverBySol(roverURL, '6', (currentPhoto.sol + 1), currentPhoto.camera.name);
})

$('#prev-sol').on('click', function(){
	fetchRoverBySol(roverURL, '6', (currentPhoto.sol - 1), currentPhoto.camera.name);
})

$('#submit_sol').on('click', function(e){
	e.preventDefault();
	var soles = document.getElementById('sol');
	new_sol = soles.elements[0].value;
	fetchBySol(roverURL, '6', new_sol, currentPhoto.camera.name);
});


function fetchBySol(url, rover, sol, cam) {
	$.ajax({
        url: url + rover
        	 + '?sol=' + sol 
        	 + '&camera__name=' + cam, 
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	console.log(url, rover, sol, cam)
        	console.log(response);
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        }
    });	
}


// $('#curioisity_rover').on('click', function(e){
//     e.preventDefault();
// 	console.log('HEY ', e)
// 	rover = e.target.data[rover];
// 	console.log(rover);

// })


