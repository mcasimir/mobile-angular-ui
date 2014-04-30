$(document).ready(function(){
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-48036416-1', 'mobileangularui.com');
  ga('send', 'pageview');
  
  if ($('#current-version').length) {
    $.get('https://api.github.com/repos/mcasimir/mobile-angular-ui/tags?callback', function(data){
        var versions = $.map(data, function(ver) {
          // i.e. 1.1.0-beta.5

          var name = ver.name.replace(/^v/, "").split('-');
          var base = name[0].split('.');
          var label = name[1]
          res = {
            major: parseInt(base[0]),
            minor: parseInt(base[1]),
            patch: parseInt(base[2]),
            label: label
          }
          return res;
        });
        
        var pad = function(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };

        var labelToInt = function(label) {
          if (label == null) {
            return 0;
          };

          var parts = label.split('.')
          var name = parts[0]
          var subv = parts[1] || 0
          var v = parseInt(name.replace(/rc/i, "3").replace(/beta/i, "2").replace(/alpha/i, "1"));

          var res = parseInt(v + pad(subv, 5));
          return res;
        };

        versions = versions.sort(function(v1, v2){
          if (v1.major == v2.major) {
            if (v1.minor == v2.minor) {
              if (v1.patch == v2.patch) {
                return labelToInt(v1.label) - labelToInt(v2.label);
              } else {
                return v1.patch - v2.patch;
              }
            } else {
              return v1.minor - v2.minor;
            }
          } else {
            return v1.major - v2.major;
          }
        });

        var last = versions[versions.length - 1];
        var number = $.grep([last.major, last.minor, last.patch], function(e){
          return e != null;
        }).join('.');

        if(last.label != null) {
          number += ("-" + last.label);
        }

        $('#current-version').text(number);
        
      
    });
  };

  $('#toc').toc({
      'selectors': 'h2,h3', //elements to use as headings
      'container': '#docs', //element to find all selectors in
      'smoothScrolling': true, //enable or disable smooth scrolling on click
      'highlightOnScroll': true, //add class to heading that is currently in focus
      'highlightOffset': 100, //offset to trigger the next headline
  });

  var sidebarContainer = $("#sidebar-container");
  var sidebar = $("#sidebar");

  adjustSidebar = function(e) {
    if (sidebarContainer.length > 0) {
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
});