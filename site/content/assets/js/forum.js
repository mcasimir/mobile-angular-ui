$(document).ready(function(){
  if ($('#forum').length) {
    var alertHtml = '<div class="alert alert-info alert-top text-center">' +
    '<a href="" class="close"></a>' +
    'Please don\'t use this forum to report issues. <a href="https://github.com/mcasimir/mobile-angular-ui/issues?state=open" target="_blank"><b>Report them on Github</b></a> instead. &nbsp;'+
    '<a href="" id="dont-bother-again" class="btn btn-default">Ok. Got it</a>' +
    '</div>';


    if (!$.cookie('hideMauiForumIssueNotice')) {
      var alertEl = $(alertHtml);
      $('#forum').prepend(alertEl);

      $('#dont-bother-again').click(function(e){
        alertEl.remove();
        $.cookie('hideMauiForumIssueNotice', true, { expires: (365 * 30) });
        e.preventDefault();
        return false;
      });
    }

    document.getElementById('loading-forum-txt').appendChild( document.createTextNode("Loading Forum ...") );
    function hideLoading() {
      var loadingEl = document.getElementById('loading');
      loadingEl.parentNode.removeChild(loadingEl);
    }
    document.getElementById('forum_embed').onload = hideLoading;
    document.getElementById('forum_embed').src =
       'https://groups.google.com/forum/embed/?place=forum/mobile-angular-ui-forum'
       + '&showsearch=true&showpopout=true&showtabs=false&hideforumtitle=true&hidesubject=true'
       + '&parenturl=' + encodeURIComponent(window.location.href);
  };
});

