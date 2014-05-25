class WrapInContainer < Nanoc::Filter
  identifier :wrap_in_container
  type :text
  def run(content, params={})
    "<div class=\"container\">#{content}</div>"
  end
end

class PrependTitleAndDesc < Nanoc::Filter
  identifier :prepend_title_and_desc
  type :text
  def run(content, params={})
    post = params[:item]
    share_link = url_for(post)
    """
<div class=\"page-header\">
  <div class=\"btn-group pull-right\">
    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">
      <i class=\"fa fa-share\"></i> <span class=\"caret\"></span>
    </button>
    <ul class=\"dropdown-menu\" role=\"menu\">
    <li><a href=\"https://twitter.com/intent/tweet?url=#{share_link}\" class=\"share-btn\" target=\"_blank\"><i class='fa fa-twitter-square'></i> Twitter</a></li>
    <li><a href=\"https://www.facebook.com/sharer/sharer.php?u=#{share_link}\" class=\"share-btn\" target=\"_blank\"><i class='fa fa-facebook-square'></i> Facebook</a></li>
    <li><a href=\"https://plus.google.com/share?url=#{share_link}\" class=\"share-btn\" target=\"_blank\"><i class='fa fa-google-plus-square'></i> Google+</a></li>
    </ul>
  </div>

  <h1 class=\"post-title\">#{post[:title]}</h1>

  <div class=\"description post-description\">#{post[:description]}</div>
</div>
<div class=\"post-content\">#{content}</div>

<hr />

<div id=\"disqus_thread\"></div>
    <script type=\"text/javascript\">
        
        var disqus_shortname = 'mobileangularui'; // required: replace example with your forum shortname

        
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
    </script>    

    """
  end
end





 