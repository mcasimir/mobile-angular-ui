include Nanoc::Helpers::Rendering
include Nanoc::Helpers::HTMLEscape
include Nanoc::Helpers::Blogging
include Nanoc::Helpers::Tagging
include Nanoc::Helpers::LinkTo

def include_js(files)
  files = Array(files)
  js_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/assets/js/#{file}/"}
    puts "File #{file} doesn't exist!" unless item
    js_arr << item.compiled_content
  end
  js_arr.join("\n")
end

def include_css(files)
  files = Array(files)
  css_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/assets/css/#{file}/"}
    puts "File #{file} doesn't exist!" unless item
    css_arr << item.compiled_content
  end
  css_arr.join("\n")
end

def site_title
  "Mobile Angular UI"
end

def site_tagline
  "Angular JS Mobile UI framework with Bootstrap 3 Css"
end

def the_title
  if @item != nil and @item[:title] != nil
    [@item[:title], site_title].join(" | ")
  else
    [site_title, site_tagline].join(" - ")
  end
end


def base_url
  @site.config[:base_url]
end

def the_image_url
  "#{base_url}/og-logo.png"
end

def is_home?
  @item == nil or @item.identifier.chop == ""
end

def is_article?
  @item != nil and @item[:kind] == "article"
end

def site_description
  "Mobile Angular UI is an HTML5 mobile UI framework that will let you use Angular Js and Bootstrap 3 for mobile app development."
end

def the_description
  if @item != nil and @item[:description] != nil and @item.identifier.chop != ""
    @item[:description]
  elsif @item.identifier.chop != ""
    site_description
  else
    ""
  end
end


def friendly_date(date)
  Date.parse(date.to_s).strftime("%B %d, %Y")
end