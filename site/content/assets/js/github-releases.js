// https://api.github.com/repos/mcasimir/mobile-angular-ui/tags?callback
GithubReleases = function(user, repo) {
  this.tagsEndpoint = "https://api.github.com/repos/" + user + "/" + repo + "/tags?callback";
  this.tagsBase = "https://github.com/" + user + "/" + repo + "/releases/tag/";
}

GithubReleases.prototype.fetch = function(callback) {
  var thisObj = this;

  $.get(this.tagsEndpoint, function(data){
    var versions = data.map(function(ver) {
        var name = ver.name.replace(/^v/, "").split('-'),
            base = name[0].split('.'),
            label = name[1],

            res = {
              major: parseInt(base[0]),
              minor: parseInt(base[1]),
              patch: parseInt(base[2]),
              zipball_url: ver.zipball_url,
              tarball_url: ver.tarball_url,
              label: label
            }

        res.number = [res.major, res.minor, res.patch].filter(function(e){
          return e != null;
        }).join('.');

        if(res.label != null) {
          res.number += ("-" + res.label);
        }

        res.link = thisObj.tagsBase + res.number;

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

        var parts = label.split('.');
        var name = parts[0];
        var subv = parts[1] || 0;
        var v = parseInt(name.replace(/rc/i, "3").replace(/beta/i, "2").replace(/alpha/i, "1"));

        var res = parseInt(v + pad(subv, 5));
        return res;
      };

      versions = versions.sort(function(v1, v2){
        if (v1.major == v2.major) {
          if (v1.minor == v2.minor) {
            if (v1.patch == v2.patch) {
              return labelToInt(v2.label) - labelToInt(v1.label);
            } else {
              return v2.patch - v1.patch;
            }
          } else {
            return v2.minor - v1.minor;
          }
        } else {
          return v2.major - v1.major;
        }
      });

      callback(versions);
  });


};


