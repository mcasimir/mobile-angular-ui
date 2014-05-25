usage       'create:post [options]'
aliases     :cp
summary     'create a new blog post'
description ''
 
flag   :h, :help,  'show help for this command' do |value, cmd|
  puts cmd.help
  exit 0
end
 
run do |opts, args, cmd|
  title = args.first
  puts "Creating a blog post with a name '#{title}'. Stand by..."
 
  date = Time.now 
  
  filename, path = calc_path(title, date)
 
  template = <<TEMPLATE
---
title: "#{title}"
created_at: #{date.strftime("%Y-%m-%d")}
description: ""
kind: article
---
 
TODO: Add content to `#{path}.`
TEMPLATE
 
  File.open(path, 'w') { |f| f.write(template) }
  puts "\t[ok] Edit #{path}"
end
 
def calc_path(title, date)
  filename = "#{date.strftime('%Y-%m-%d')}-#{title.downcase.split.join('-')}.md"
  path = "content/posts/#{filename}"
  [filename, path]
end