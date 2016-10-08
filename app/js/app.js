var WebMasterGroup = (function($, window, undefined) {

  function initSlick(){
    $('[data-carousel]').slick({
      mobileFirst: true,
      dots: true,
      prevArrow: false,
      nextArrow: false
    });
  };

  function setPaddingBody(){
    var el = $('[data-padding]'),
      body = $('body');

    body.css('paddingTop', el.height());
  };

  function scrollEl(){
    $('[data-srroll]').click(function(e) {
      var self = $(this);
      var target = $(self.attr('data-srroll'));

      e.preventDefault();
      $('[data-srroll]').not(this).parent('li').removeClass('active');
      self.parent('li').addClass('active');
      if (target.length) {
        $('html, body').stop(true, true).animate({
          scrollTop: target.offset().top - $('[data-padding]').height()
        }, 1000);
        return false;
      }
    });
  };

  return {
    initSlick: initSlick,
    setPaddingBody: setPaddingBody,
    scrollEl: scrollEl
  };

})(jQuery, window);

jQuery(function() {
  WebMasterGroup.initSlick();
  WebMasterGroup.setPaddingBody();
  WebMasterGroup.scrollEl();
  $(window).on('resize', function(){
    WebMasterGroup.setPaddingBody();
  });
});