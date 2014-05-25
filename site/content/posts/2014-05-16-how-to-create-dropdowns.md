---
title: "Toggle basics: creating dropdown buttons"
created_at: 2014-05-16
description: "A tutorial explaining how to create dropdown buttons with Mobile Angular UI togglable/toggle directive."
kind: article
---

Bootstrap dropdown buttons can be created using `[toggle]` and `[toggleables]` directives in Mobile Angular UI.

To clarify how to realize dropdown interaction we should resort to the original Bootstrap behavior and markup.

This is the basic markup to create a dropdown with Boostrap (css only, no interaction).

``` html
<div class="btn-group">
  <button type="button" 
    class="btn btn-default dropdown-toggle">
    Action <span class="caret"></span>
  </button>

  <ul class="dropdown-menu">
    <!-- ... -->
  </ul>
</div>
```

With the markup above we will see only a button, since the dropdown is closed. 

To make the dropdown appear we have to add the `.open` class to the outer element `.btn-group`.

``` html
<div class="btn-group open">
  <!-- ... -->
</div>
```

That's all we need to replicate the Bootstrap dropdown style.

### Making it interactive

According to what we said above we should alternately add/remove the `.open` class on `.btn-group` element when the button is clicked.

Basically we can achieve this behavior through a toggleable element.

A toggleable element listen for commands sent to it and react changing it's state between active/inactive according to the command received.

When a toggleable changes it's state its activation/inactivation state can be reflected applying a class to the element itself or to its parent with the apposite attributes: `active-class`, `inactive-class`, `parent-active-class`, `parent-inactive-class`.

That said we can setup toggleable on `btn-group` element, having the `open` class applyed in response to its active state:

``` html
<div class="btn-group" toggleable active-class='open'>
  <!-- ... -->
</div>
```

### Sending commands to toggleables

Now that we know how to make an element respond to its activation we should learn how to send activation commands to it.

For this `mobile-angular-ui.directives.toggle` module sets up two functions in `$rootScope`: `toggle(id, command)` and `toggleByClass(className, command)`.

The first thing you notice is that we should know the id or the class of the target toggleable, so lets add one to our:

``` html
<div class="btn-group" toggleable active-class='open' id="myToggleableDropdown">
  <!-- ... -->
</div>
```

Now in our controller we could simply call: 

``` javascript
$rootScope.toggle('myToggleableDropdown', 'on');
```

to make the dropdown show.

Anyway we can realize the whole interaction without javascript, using the [toggle] directive.

### Setting up toggle command triggers with markup

To create a trigger element for toggle commands we should setup the toggle directive on the desired element.

When a `[toggle]` element is clicked (or tapped). A message is sent to toggleables according to its parameters.

A toggle command can be one of: `on`, `off` or `toggle` (default to `toggle`). Command to be sent is specified as value for `toggle` attribute.

So in order to make the button send a `toggle` command (alternate `on` and `off`) we can just add `toggle` attribute specifing the recipient toggleable id in the `target` attribute:

``` html
<button type="button" 
  class="btn btn-default dropdown-toggle" toggle target="myToggleableDropdown">
  <!-- ... -->
</button>
```

Now clicking on the button we should see the dropdown opening and closing.

### Making dropdown closes clicking links

To make the dropdown close by clicking on any of its inner links we should setup `[toggle]` directive on menu items parent also. 

This time clicking on any element inside the menu the dropdown should always receive the 'off' message, this can be specified defining `toggle='off'` attribute.

<ul class="dropdown-menu" toggle="off" target="myToggleableDropdown">
  <!-- ... -->
</ul>

This should be enough but you should notice that this way links would be never activated.

Using the `bubble` attribute of `toggle` directive is required here to make click events propagate to inner links, otherwise clicks are catched by `[toggle]` elements:

<ul class="dropdown-menu" toggle="off" target="myToggleableDropdown" bubble>
  <!-- ... -->
</ul>

Here is the complete snippet of code.

``` html
<div class="btn-group" toggleable id="myToggleableDropdown" active-class="open">

  <button type="button" 
    class="btn btn-default dropdown-toggle" toggle target="myToggleableDropdown">
    Action <span class="caret"></span>
  </button>

  <ul class="dropdown-menu" toggle="off" target="myToggleableDropdown" bubble>
    <!-- ... -->
  </ul>

</div>
```
