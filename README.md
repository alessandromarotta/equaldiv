# EqualDiv
EqualDiv makes simple to give multiple items equal height. Written in vanilla Javascript without dependencies.

HOW TO USE:
- include equalDiv.js in your DOM
- initialize with "equalDiv.init();"
- add in your resize event handler "equalDiv.equalize();"

EqualDiv writes the div heights into a <style> tag to minimize browser reflow. I advice to create in your DOM an empty <style id="equalizerCSS"></style> tag and then pass the style tag ID to the "init" method.
For example:

equalDiv.init({
   styleId: 'equalizerCSS'
});

OTHER OPTION:
You can specify the breakpoint trigger (small, medium, large, xlarge) like the Foundation Equalizer ( http://foundation.zurb.com/sites/docs/equalizer.html ) via data attribute (i.e. data-equalize-on="large").
By default equaDiv will be triggered on "medium" breakpoint for all equalizers.

equalDiv.init({
   styleId: 'equalizerCSS',
   equalizeOn: 'small' // equalDiv triggers even on small devices
});

If you use another CSS framework, you can also specify breakpoint values in the "init" method (default: [0, 640, 1024, 1280, 1440])

equalDiv.init({
   styleId: 'equalizerCSS',
   breakpoint: [0, 480, 768, 992, 1200] // bootstrap breakpoint values
});

-MIN HEIGHT
You can specify a minimum height for each equalizer by the data attribute "data-equalizer-minheight" (i.e. <div id="one" class="row small-up-2 medium-up-3 large-up-4 content-wrap" data-equalizer data-equalizer-minheight="250">[...]</div>

TO DO:
- equalize by row;
- equalize with images
