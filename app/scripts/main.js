// jshint devel:true

;(function () {
	'use strict';

	// Animate CONTENT

	var animateBox = function() {
		if ( $('.animate-box').length > 0 ) {
			$('.animate-box').waypoint( function( direction ) {

				if( direction === 'down' && !$(this.element).hasClass('animated') ) {

					$(this.element).addClass('fadeIn animated');

				}
			} , { offset: '80%' } );
		}
	};

	var animateDiamond = function () {
		$('.fh5co-portfolio-item').waypoint( function( direction ){
			if (direction === 'down') {
				$('.pageHr').addClass('zoomOutDown');
			} else {
				$('.pageHr').removeClass('zoomOutDown');
			}
		});
	};

	$(function(){
		animateBox();
		animateDiamond();
	});


	// PARALLAX EFFECT
	function scrollFooter(scrollY, heightFooter)
{
    console.log(scrollY);
    console.log(heightFooter);

    if(scrollY >= heightFooter)
    {
        $('#fh5co-footer').css({
            'bottom' : '0px'
        });
    }
    else
    {
        $('#fh5co-footer').css({
            'bottom' : '-' + heightFooter + 'px'
        });
    }
}

$(window).load(function(){
    var windowHeight        = $(window).height(),
        footerHeight        = $('footer').height(),
        heightDocument      = (windowHeight) + ($('.content').height()) + ($('footer').height()) - 20;

    $('#scroll-animate, #scroll-animate-main').css({
        'height' :  heightDocument + 'px'
    });

    // $('.fh5co-intro').css({
    //     'height' : windowHeight + 'px',
    //     'line-height' : windowHeight + 'px'
    // });

    scrollFooter(window.scrollY, footerHeight);

    window.onscroll = function(){
        var scroll = window.scrollY;

        $('#scroll-animate-main').css({
            'top' : '-' + scroll + 'px'
        });

        $('.fh5co-intro').css({
            'background-position-y' : 50 - (scroll * 100 / heightDocument) + '%'
        });

        scrollFooter(scroll, footerHeight);
    };
});
}());
