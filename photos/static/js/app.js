

$('article.rover-info').hide();
$('.rover-info').removeClass('hidden')

$('.map-loc').hover(function(){
    $('.welcome').hide();
	$('article[rover-lower="' + $(this).attr('id') + '"]').fadeIn(200);
	console.log($(this).attr('id'));
}, function(){
	$('article.rover-info').hide();
	$('.welcome').fadeIn(200);
})