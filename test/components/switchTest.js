describe("switch", function() {

  it("disable should work as expected", function() {
    // Should solve: https://github.com/mcasimir/mobile-angular-ui/issues/92
    // I've tried to disable a switch component while form is in a "read-only" mode.
    // This works, but the component remains in disabled mode even when the form is in "write" mode.

    // Trying to detect what's wrong I've found a solution.
    // In the "switch" directive the line
    // ```
    // if (attrs.disabled == null) {
    // ```
    // should be changed with
    // ```
    // if (attrs.disabled == null || attrs.disabled == false) {
    // ```
    // Is it correct?

  });

  it("Should support ng-checked", function() {
    // From https://github.com/mcasimir/mobile-angular-ui/issues/87
    // 
    // Can I use ng-checked in switch component?
    // I would like to eval an expression like this using ng-checked:
    // person.enabled === 'S'
    // Thanks.
    
  });

  it("should support ng-true-value ng-false-value", function() {
    // Should support ng-true-value and ng-false-value (https://github.com/mcasimir/mobile-angular-ui/issues/86)
    // On the switch component can I use the ng-true-value and ng-false-value options, as in the checkbox?
    // Both not work for me. In docs I can't find nothing mentioning this.
    // I use chrome for debug/test with mobile emulation enabled.
    // Thanks
    
  });

  it("should support ng-change", function() {
    // Should support ng-change (https://github.com/mcasimir/mobile-angular-ui/issues/85)
    // The expression in ng-change and the ng-click for switch component not being evaluated. I put a simple "alert ('hi')". The same is not executed.
    // I use chrome for debug/test with mobile emulation enabled.
    // Thanks 

  });
});