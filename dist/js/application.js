(function ($) {
  var base = new Date('2015-09-17T08:00:00.000-0700');
  var updateSol = function () {
    $('#current-sol').text(parseInt((Date.now() - base.getTime()) / (1000 * 60 * 60 * 24)));
    $('#current-sol-dec').text('.' + ('0000'+parseInt((Date.now() - base.getTime()) % (1000 * 60 * 60 * 24) / (6 * 60 * 24))).slice(-4));
  };
  $(document).ready(function () {
    updateSol();
    setInterval(updateSol, 8640)
  });
  $('.open-content').on('click', function (e) {
    e.preventDefault();
    var $front = $(this).parents('.front');
    $front.fadeOut(300);
    $front.siblings('.post-content-overlay').fadeIn();
  });
  $('.close-content').on('click', function (e) {
    e.preventDefault();
    var $overlay = $(this).parents('.post-content-overlay');
    $overlay.fadeOut(300);
    $overlay.siblings('.front').fadeIn(300);
  });
})(window.jQuery);
