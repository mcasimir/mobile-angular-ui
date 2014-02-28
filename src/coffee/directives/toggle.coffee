(->

  # Toggle Module provides a way to implement tabs, accordions, collapsibles 
  # and other components that be selectively or exclusively switched on or off.
  #
  # It works with 2 simple directives communicating by events: toggle and toggleable.
  # 
  # 1. Any [toggle] element translates clicks on it into 'mobile-angular-ui.toggle.[alternate|activate|inactivate]' events
  # and broadcasts them through $rootScope.
  #  
  # 2. Any [toggleable] element binds on mobile-angular-ui.toggle.* events, and when such events are received updates their
  # statuses according.
  #
  # 3. Activated [toggleable]s notify the world their new status.
  # 
  # 4. [toggle] elements sync their status according to events sent by [toggleable]s. 
  #
  # 5. If a [toggleable] defines an exclusion-group then when it notices 
  # another element of the same group has been activated it
  # immediately disables himself and notify the updated state trough an event  

  #   <a  toggle="on"
  #       target="tab1"
  #       active-class="active"
  #   >
  #     Tab 1
  #   </a>

  # <div toggleable
  #      active-class="active"
  #      group="tabGroup1"
  #      id="panel1"
  # >
  #   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure,
  #   vero, incidunt, atque optio explicabo inventore itaque suscipit esse
  #   sit neque maxime veritatis temporibus est culpa officiis hic saepe
  #   adipisci iusto?
  # </div>

  #
  # Toggle
  #
  Toggle =
    moduleName: "mobile-angular-ui.directives.toggle"
    
    events:
      toggle:             "mobile-angular-ui.toggle.toggle"
      toggleByClass:      "mobile-angular-ui.toggle.toggleByClass"
      togglerLinked:      "mobile-angular-ui.toggle.linked"
      toggleableToggled:  "mobile-angular-ui.toggle.toggled"

    commands:
      alternate:  "toggle"
      activate:   "on"
      deactivate: "off"

    helpers:
      updateElemClasses: (elem, attrs, active) ->
        if active
          elem.addClass(attrs.activeClass) if attrs.activeClass
          elem.removeClass(attrs.inactiveClass) if attrs.inactiveClass
          parent = elem.parent()
          parent.addClass(attrs.parentActiveClass) if attrs.parentActiveClass
          parent.removeClass(attrs.parentInactiveClass) if attrs.parentInactiveClass
          
        else
          elem.addClass(attrs.inactiveClass) if attrs.inactiveClass
          elem.removeClass(attrs.activeClass) if attrs.activeClass
          parent = elem.parent()
          parent.addClass(attrs.parentInactiveClass) if attrs.parentInactiveClass
          parent.removeClass(attrs.parentActiveClass) if attrs.parentActiveClass

  #
  # A toggler
  #
  class Toggler
    constructor: (@scope, @elem, @attrs) ->
      @command     = @attrs.toggle or Toggle.commands.alternate
      @target      = @attrs.target
      @targetClass = @attrs.targetClass
      @rootScope   = @scope
      @bubble      = @attrs.bubble in ["true", "1", 1, "", "bubble"]

      if (not @target) and @attrs.href
        @target = @attrs.href.slice(1)

      throw "'target' or 'target-class' attribute required with 'toggle'" unless @target or @targetClass


    toggle: () -> 
      @rootScope.toggle(@target, @command)

    toggleByClass: () ->
      @rootScope.toggleByClass(@targetClass, @command)

    hasTarget: () ->
      !!@target

    hasTargetClass: () ->
      !!@targetClass

    fireTogglerLinked: () ->
      if @hasTarget()
        @rootScope.$emit(Toggle.events.togglerLinked, @target)

    link: ->

      #
      # Send events to toggleables
      #
      @elem.on "click tap", (e) =>
        unless @elem.hasClass("disabled")
          if @hasTarget()
            @toggle()

          if @hasTargetClass()
            @toggleByClass()

          unless @bubble
            e.preventDefault()
            false
          else
            true

      #
      # Sync state with related toggleables
      #
      @scope.$on Toggle.events.toggleableToggled, (e, id, newState) =>
        if id is @target
          Toggle.helpers.updateElemClasses(@elem, @attrs, newState)

      #
      # Notify new togglers to toggleables
      #
      @fireTogglerLinked()

  #
  # A toggleable
  #
  class Toggleable
    constructor: (@scope, @elem, @attrs) ->
      @id = @attrs.id
      @exclusionGroup = @attrs.exclusionGroup
      @toggleState = false
      @default = @attrs.default
      @rootScope = @scope.$root

    setToggleState: (value) ->
      if value isnt @toggleState
        @toggleState = value

    getToggleState: ->
      !!@toggleState

    notifyToggleState: () ->
      @rootScope.$emit(Toggle.events.toggleableToggled, @id, @getToggleState(), @exclusionGroup)

    toggleStateChanged: ->
      @notifyToggleState()    
      Toggle.helpers.updateElemClasses(@elem, @attrs, @getToggleState())

    runCommand: (command) ->
      oldState = @getToggleState()
      switch command
        when Toggle.commands.activate
          @setToggleState(true)
        when Toggle.commands.deactivate
          @setToggleState(false)
        when Toggle.commands.alternate
          @setToggleState(!@getToggleState())        

      if oldState isnt @getToggleState()
        @toggleStateChanged()

    link: ->
      if @default    
        switch @default
          when "active"
            @setToggleState(true)
          when "inactive"
            @setToggleState(false)

        @toggleStateChanged()

      #
      # Observe togglers
      #
      @scope.$on Toggle.events.toggle, (e, target, command) =>
        if target is @id
          @runCommand(command)

      @scope.$on Toggle.events.toggleByClass, (e, targetClass, command) =>
        if @elem.hasClass(targetClass)
          @runCommand(command)

      #
      # Inactivate the exclusion group
      #
      @scope.$on Toggle.events.toggleableToggled, (e, target, newState, sameGroup) =>
        if newState and (@id isnt target) and (@exclusionGroup is sameGroup) and @exclusionGroup?
          @setToggleState(false)
          @toggleStateChanged()

      #
      # Listen for new togglers to sync their state
      #
      @scope.$on Toggle.events.togglerLinked, (e, target) =>
        if @id is target
          @notifyToggleState()


  #
  # Angular Module
  #
  angular.module(Toggle.moduleName, [])

  #
  # Sets up global 'toggle' and 'toggleByClass' function
  #
  .run(["$rootScope", ($rootScope) ->
    $rootScope.toggle = (target, command = "toggle") ->
      $rootScope.$emit(Toggle.events.toggle, target, command)
    
    $rootScope.toggleByClass = (targetClass, command = "toggle") ->
      $rootScope.$emit(Toggle.events.toggleByClass, targetClass, command)

  ])

  .directive('toggle', ["$rootScope", ($rootScope) ->
      restrict: "A"
      link: (scope, elem, attrs) ->
        toggler = new Toggler($rootScope, elem, attrs)
        toggler.link()

    ])

  .directive('toggleable', ["$rootScope", ($rootScope) ->
      restrict: "A"
      
      link: (scope, elem, attrs) ->
        toggleable = new Toggleable($rootScope, elem, attrs)
        toggleable.link()
    
  ])

)()