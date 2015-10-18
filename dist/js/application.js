(function ($) {
  var base = new Date('2015-09-17T08:00:00.000-0700');
  var updateSol = function () {
    $('#current-sol').text(parseInt((Date.now() - base.getTime()) / (1000 * 60 * 60 * 24)));
    $('#current-sol-dec').text('.' + ('0000'+parseInt((Date.now() - base.getTime()) % (1000 * 60 * 60 * 24) / (6 * 60 * 24))).slice(-4));
  };
  var posts;
  var fixOffset = function (i) {
    var h = $(posts[i]).height();
    $(posts[i]).removeClass('fix-offset');
    if (window.innerHeight % 4 != h  % 4 && (window.innerHeight + 1) % 4 != h  % 4)
      $(posts[i]).addClass('fix-offset');
  };
  $(document).ready(function () {
    updateSol();
    setInterval(updateSol, 8640);
    posts = $('.post-content');
  });
  $(window).on('resize', function (e) {
    fixOffset($('.post-indicator.active').attr('data-slide-to') - 1);
  });
  $('.open-content').on('click', function (e) {
    e.preventDefault();
    var $front = $(this).parents('.front');
    $front.fadeOut(300);
    $front.siblings('.post-content-overlay').fadeIn(function () {
      fixOffset($('.post-indicator.active').attr('data-slide-to') - 1);
    });
  });
  $('.close-content').on('click', function (e) {
    e.preventDefault();
    var $overlay = $(this).parents('.post-content-overlay');
    $overlay.fadeOut(300);
    $overlay.siblings('.front').fadeIn(300);
  });
})(window.jQuery);
