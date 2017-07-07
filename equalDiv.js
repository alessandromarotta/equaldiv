(function(f) {
    window.equalDiv = f();
})(function() {

    var
        i = 0,
        j = 0,

        matchedElemHeight = 0,
        scheduledResizeFrame = false,

        currentEqualizer,
        equalizers,

        equalizeOn,
        currentWidth = window.innerWidth,
        lastKnownWidth = currentWidth;

    function reflow() { 

        for (i=0; i < equalizers.length; i++) {
            
            currentEqualizer = equalizers[i];

            if (currentEqualizer.hasBeenModified) {
                
                currentEqualizer.hasBeenModified = false; // reset property

                for (j=0; j < currentEqualizer.items.length; j++)
                    currentEqualizer.items[j].style.height = currentEqualizer.lastKnownHeight; // set new height to shadow elements

           }

        }

        scheduledResizeFrame = false;

    }

    function equalize() {

        for (i=0; i < equalizers.length; i++) {

            currentEqualizer = equalizers[i];
            
            if( currentWidth > equalizeOn && currentWidth > currentEqualizer.equalizeOn ) {
                
                currentEqualizer.heightArray = [];

                for (j=0; j < currentEqualizer.items.length; j++) {
                    currentEqualizer.items[j].style.height = '';
                    matchedElemHeight = currentEqualizer.items[j].offsetHeight;
                    currentEqualizer.heightArray.push( matchedElemHeight > currentEqualizer.minHeight ? matchedElemHeight : currentEqualizer.minHeight );
                }

                currentEqualizer.lastKnownHeight = Math.max.apply(null, currentEqualizer.heightArray);
                currentEqualizer.hasBeenModified = true;

            } else {

                if (currentEqualizer.lastKnownHeight>0)
                    currentEqualizer.hasBeenModified = true;

                currentEqualizer.lastKnownHeight = '';

            }
                
        }

        requestAnimationFrame(reflow);

    }

    function resize() {
        currentWidth = window.innerWidth; 
        if ( currentWidth === lastKnownWidth || scheduledResizeFrame ) {
            scheduledResizeFrame = false;
            return;
        }

        lastKnownWidth = currentWidth;
        scheduledResizeFrame = true;
        equalize();
    }

    function init(config) {

        var
            data = config || {},
            watchClass = data.watch || 'equalizer',
            equalizerElems = document.body.getElementsByClassName(watchClass),
            breakpointValues = data.breakpoint || [0, 640, 1024, 1280, 1440]; // default Foundation 6 breakpoints
            

        function getBreakpointWidth(value) {
            switch(value) {
                case 'small':
                    return breakpointValues[0] || 0;
                case 'medium':
                    return breakpointValues[1] || 640;
                case 'large':
                    return breakpointValues[2] || 1024;
                case 'xlarge':
                    return breakpointValues[3] || 1280;
                case 'xxlarge':
                    return breakpointValues[4] || 1440;
                default:
            }
        }

        if( !equalizerElems )
            return;

        equalizeOn = getBreakpointWidth(data.equalizeOn || 'medium'); // default (tablet and above)

        equalizers = (function(elements) {

            var 
                i = 0,
                elementsObjArray = [];

            function _equalizer( equalizerContainer ) {
                this.items = equalizerContainer.getElementsByClassName(watchClass + '-watch'); // live elements
                this.equalizeOn = getBreakpointWidth(equalizerContainer.getAttribute("data-equalize-on")) || equalizeOn;
                this.heightArray = [];
                this.minHeight = equalizerContainer.getAttribute("data-equalizer-minheight") || 0;
                this.hasBeenModified = false;
                this.lastKnownHeight = 0;
            }

            for(; i < elements.length; i++)
                elementsObjArray.push( new _equalizer(elements[i]) );

            return elementsObjArray;

        })(equalizerElems);

        breakpointValues.map(getBreakpointWidth);
        equalize();

    }
    

    return {
        init: init,
        resize: resize,
    };

});