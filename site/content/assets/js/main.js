<%= include_js 'es5-shim' %>
<%= include_js 'jquery' %>
<%= include_js 'bootstrap' %>
<%= include_js 'jquery-toc-min' %>
<%= include_js 'jquery-cookie' %>
<%= include_js 'github-releases' %>
<%= include_js 'forum' %>

$(document).ready(function(){

  if ($('.current-version, .current-release-link').length) {
    (new GithubReleases('mcasimir', 'mobile-angular-ui')).fetch(function(releases){
      $('.current-version').text(releases[0].number);
      $('.current-release-link').attr('href', releases[0].zipball_url);
    });
  }

  $('#toc').toc({
      'selectors': 'h2,h3', //elements to use as headings
      'container': '#docs', //element to find all selectors in
      'smoothScrolling': true, //enable or disable smooth scrolling on click
      'highlightOnScroll': true, //add class to heading that is currently in focus
      'highlightOffset': 100, //offset to trigger the next headline
      anchorName: function(i, heading, prefix) { //custom function for anchor name
          var aname = $(heading).data('toc');
          return aname || prefix+i;
      }
  });

  var sidebarContainer = $("#sidebar-container");
  var sidebar = $("#sidebar");
  var footer  = $('.footer');

  adjustSidebar = function(e) {
    var scrollBottom = $(window).scrollTop() + $(window).height();
    var footerTop = footer.offset().top;

    if (sidebarContainer.length > 0) {
      var sidebarMaxHeight = (footerTop >= scrollBottom) ? $(window).height() : $(window).height() - (scrollBottom - footerTop);
      sidebar.css("max-height", sidebarMaxHeight);
      
      var tocOffsetTop = sidebarContainer.offset().top;
      if($(window).scrollTop() >= tocOffsetTop) {
        sidebar.addClass("fix");
        sidebar.css("left", sidebarContainer.offset().left);
        sidebar.css("width", sidebarContainer.width());
      } else {
        sidebar.removeClass("fix");
        sidebar.css("left", 'auto');
      }        
    };
  };

  $(window).scroll(adjustSidebar);
  $(window).resize(adjustSidebar);

  $(window).on('resize', function(){
    var main = $('#main');
    if(main.length) {
      main.css('min-height', $(window).height());
    }
  }).trigger('resize');

});

