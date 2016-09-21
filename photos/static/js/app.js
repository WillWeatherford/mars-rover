

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

var mainURL = '/api/photos/267550';

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

fetchPhotos(mainURL)

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



