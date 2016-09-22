

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

var curiosity = 'Curiosity';
var opportunity = 'Opportunity';
var spirit = 'Spirit';

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
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response
        	SolInfo.loadall(response)
        	buildSolInfo();
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


// FETCH THE ROVER
function fetchRover(url, rover) {
    $.ajax({
        url: url + rover,
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        	SolInfo.loadall(response);
        	buildSolInfo();
        }
    });
}

$('#Opportunity').on('click', function(argument) {
	console.log(argument);
	fetchRover(roverURL, opportunity);
});



function fetchRoverBySol(url, rover, sol, cam) {
    $.ajax({
        url: url + rover
        	 + '?sol=' + sol 
        	 + '&camera__name=' + cam, 
        type: 'GET',
        dataType: 'json',
        success: function(response){
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        	// SolInfo.loadall(response);
        	// buildSolInfo();
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
        	$('#main-photo').attr('src', response.img_src);
        	currentPhoto = response;
        	// SolInfo.loadall(response);
        	// buildSolInfo();
        }
    });	
}



function SolInfo(details) {
	var j = 0;
	details.concurrent.forEach(function(i){
		var word = 'cam_' + String(j)
		this.word = i
		j = j + 1; 
	});
}

SolInfo.all = []
SolInfo.loadall = function(response) {
    SolInfo.all = [];
    // if (response.concurrent){
    //     SolInfo.all.push(new SolInfo(response))
    // console.log(SolInfo.all)
    // }

	photo_list = response.concurrent;
	for (var i = 0; i < photo_list.length; i++) {
		for (var property in photo_list[i]) {
	        if (photo_list[i].length > 0){
	            SolInfo.all.push(new SolInfo(photo_list[i]))
	        }
	    }
	}

};

SolInfo.prototype.compileTemplateInfo = function(){
    var source = $('#cam-details').html();
    template = Handlebars.compile(source)
    return template(this)
}


function buildSolInfo(){
    $('.camera-info').empty();
    SolInfo.all.forEach(function(a){
        $('.camera-info').append(a.compileTemplateInfo());
    });
}




// $('#curioisity_rover').on('click', function(e){
//     e.preventDefault();
// 	console.log('HEY ', e)
// 	rover = e.target.data[rover];
// 	console.log(rover);

// })


