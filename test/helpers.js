module.exports = {
  shouldNotThrow: function() {
    afterEach(function() {  
      browser.manage().logs().get('browser').then(function(browserLog) {
        var i = 0,
        severeWarnings = false;

        for(i; i<=browserLog.length-1; i++){
          if(browserLog[i].level.name === 'SEVERE'){
            console.log('\n' + browserLog[i].level.name);
            console.error('(Possibly exception) \n' + browserLog[i].message);
            severeWarnings = true;
          }
        }

        expect(severeWarnings).toBe(false);
      }); // ~ then
    });  
  }
};