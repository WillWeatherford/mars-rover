

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

// $('#main_home').show();
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

// function SolInfo (opts) {
//   for(var key in opts) {
//     this[key] = opts[key];
//   }
// }

// SolInfo.prototype.toHtml = function() {
//   var source = $('#cam-template').html();
//   var templateRender = Handlebars.compile(source);
//   return templateRender(this);
// };


function getRover(url, rover) {
    console.log('hey')
    $.ajax({
        url: url + rover,
        type: 'GET',
        dataType: 'json',
        success: function(response){

            var concurrentArray = []
            var conArray = []

            console.log(response);
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

            // for (var i = 0; i < response.concurrent.length; i++) {
            //     if (response.concurrent[i].img_src !== "notreal.jpg") {
            //         // console.log(response.concurrent[i])
            //         concurrentArray.push(response.concurrent[i]);
            //     }
            // }
            // var different_cam = $('#diff_camera').text(response.concurrent[0].camera.full_name);
            // var contains[1] = $('#concurrent_img').attr('src', response.concurrent[0].img_src);
            for (var i = 0; i < response.concurrent.length; i++) {
                $('#concur_container').append('<h3 id="diff_camera">' + response.concurrent[i].camera.full_name + '</h3>')
                if (response.concurrent[i].img_src === 'notreal.jpg') {
                    $('#concur_container').append('<img src="/static/img/null_rover.jpg" id="concurrent_img">');
                } else {
                    camButtons.push(i);
                    $('#concur_container').append('<img class="' + i + '" src="' + response.concurrent[i].img_src + '" id="concurrent_img"></a>');
                    $('#concur_container').append('<button type="button" name="button" id="' + i + '" class="button-primary col-xs-3 col-md-6 col-sm-12">Switch Camera</button>');
                }
            }

            // for (var i = 0; i < camButtons.length; i++) {
            //     Things[i]
            // }

            // console.log(concurrentArray)
            currentPhoto = response;
            k = 0;
            for (var j = 0; j < camButtons.length; j++) {
                $('#' + camButtons[j]).on('click', function() {
                    // console.log(response)
                    fetchPhotos(currentPhoto.concurrent[k].url)
                    // console.log(response.concurrent[k].url)
                    k = k + 1;
                })
            }

            // concurrentArray.forEach(function(ele){
            //     conArray.push(new SolInfo(ele));
            // });
            // console.log(conArray);



            // conArray.forEach(function(a){
            //     // console.log(a);
            //     $('#concurrent-photos').append(a.toHtml());
            // });


            // SolInfo.loadall(response)
            // buildSolInfo();
        }
    });
};

// for (var i = 0; i < camButtons.length; i++) {
//     $('#' + camButtons[i]).on('click', function() {
//         console.log(currentPhoto)
//     })
// }






// AJAX CALL TO THE PHOTOS
function fetchPhotos(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(response){
            console.log(response)
        	// $('#main-photo').attr('src', response.img_src);
            if (response.next_photo === null || response.prev_photo === null) {
                $('#main-photo').attr('src', '/static/img/null_rover.jpg');
            } else {
                $('#main-photo').attr('src', response.img_src);
            }
            $('#camera_name').text('Camera: ' + response.camera.full_name);
            $('#sol_date').text('Sol Date: ' + response.sol);
            $('#earth_date').text('Earth Date: ' + response.earth_date);
        	currentPhoto = response
        	// SolInfo.loadall(response)
        	// buildSolInfo();
            k = 0;
            for (var j = 0; j < camButtons.length; j++) {
                $('#' + camButtons[j]).on('click', function() {
                    // console.log(response)
                    fetchPhotos(currentPhoto.concurrent[k].url)
                    // console.log(response.concurrent[k].url)
                    k = k + 1;
                })
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
        	currentPhoto = response;
        	SolInfo.loadall(response);
        	buildSolInfo();
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
        	// $('#main-photo').attr('src', response.img_src);
            if (response.next_photo === null) {
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



// function SolInfo(details) {
// 	var j = 0;
// 	details.concurrent.forEach(function(i){
// 		var word = 'cam_' + String(j)
// 		this.word = i
// 		j = j + 1; 
// 	});
// }

// SolInfo.all = []
// SolInfo.loadall = function(response) {
//     SolInfo.all = [];
//     // if (response.concurrent){
//     //     SolInfo.all.push(new SolInfo(response))
//     // console.log(SolInfo.all)
//     // }

// 	photo_list = response.concurrent;
// 	for (var i = 0; i < photo_list.length; i++) {
// 		for (var property in photo_list[i]) {
// 	        if (photo_list[i].length > 0){
// 	            SolInfo.all.push(new SolInfo(photo_list[i]))
// 	        }
// 	    }
// 	}

// };

// SolInfo.prototype.compileTemplateInfo = function(){
//     var source = $('#cam-details').html();
//     template = Handlebars.compile(source)
//     return template(this)
// }


// function buildSolInfo(){
//     $('.camera-info').empty();
//     SolInfo.all.forEach(function(a){
//         $('.camera-info').append(a.compileTemplateInfo());
//     });
// }




// $('#curioisity_rover').on('click', function(e){
//     e.preventDefault();
// 	console.log('HEY ', e)
// 	rover = e.target.data[rover];
// 	console.log(rover);

// })


