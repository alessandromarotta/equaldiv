(function(f) {
    window.equalDiv = f();
})(function() {

    var
        i = 0,
        j = 0,
        equalizerStyleEl,
        equalizerCSSRules = '',
        matchedElemHeight = 0,
        currentEqualizer,
        equalizers;

    function equalize(currentWidth) {

        // reset Equalizer CSS rules
        equalizerCSSRules = '';
        // invalidate layout
        equalizerStyleEl.textContent = '';

        for (i=0; i < equalizers.length; i++) {

            currentEqualizer = equalizers[i];

            if(currentWidth > currentEqualizer.equalizeOn) {

                currentEqualizer.heightArray = [];
                
                // recalculate style and force layout
                for (j=0; j < currentEqualizer.items.length; j++) {
                    currentEqualizer.items[j].classList.add(currentEqualizer.id + i);
                    matchedElemHeight = currentEqualizer.items[j].clientHeight;
                    currentEqualizer.heightArray.push( matchedElemHeight > currentEqualizer.minHeight ? matchedElemHeight : currentEqualizer.minHeight );
                }

                currentEqualizer.lastKnownHeight = Math.max.apply(null, currentEqualizer.heightArray);
                currentEqualizer.hasBeenModified = true;

            } else {

                if (currentEqualizer.lastKnownHeight>0) {
                    currentEqualizer.hasBeenModified = true;
                }

                // reset lastKnownHeight property
                currentEqualizer.lastKnownHeight = '';

            }
        
            if (currentEqualizer.hasBeenModified) {
                equalizerCSSRules+='.' + currentEqualizer.id + i +'{height:'+currentEqualizer.lastKnownHeight+'px;}';
                currentEqualizer.hasBeenModified = false; // reset property  
            }

        }

        // style & layout
        equalizerStyleEl.textContent = equalizerCSSRules;

    }

    function init(config) {

        var
            data = config || {},
            watchClass = data.watch || 'equalizer',
            styleId = data.styleId || 'equalizerCSS',
            currentWidth = data.currentWidth || window.innerWidth,
            equalizerElems = document.body.querySelectorAll('[data-' + watchClass + ']'),
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

        if( !equalizerElems ) {
            equalizerStyleEl = null;
            equalizerCSSRules = null;
            matchedElemHeight = null;
            currentEqualizer = null;
            equalizers = null;
            return;
        }

        equalizers = (function(elements) {

            var 
                i = 0,
                elementsObjArray = [];
           
            equalizerStyleEl = document.getElementById(styleId); // override equalizerStyleEl

            // no <style> tag? => create it!
            if (!equalizerStyleEl) {
                equalizerStyleEl = document.createElement('style');
                equalizerStyleEl.id = styleId;
                document.getElementsByTagName('head')[0].appendChild(equalizerStyleEl);
            }

            function _equalizer( equalizerContainer ) {
                this.id = equalizerContainer.getAttribute("data-equalizer") || 'equ',
                this.items = equalizerContainer.querySelectorAll('[data-' + watchClass + '-watch]'), // live elements
                this.equalizeOn = getBreakpointWidth(equalizerContainer.getAttribute("data-equalize-on")) || getBreakpointWidth(data.equalizeOn || 'medium');
                this.heightArray = [];
                this.minHeight = equalizerContainer.getAttribute("data-equalizer-minheight") || 0;
                this.hasBeenModified = false;
                this.lastKnownHeight = 0;
            }

            for(; i < elements.length; i++) {
                elementsObjArray.push( new _equalizer(elements[i]) );
            }

            return elementsObjArray;

        })(equalizerElems);

        breakpointValues.map(getBreakpointWidth);
        equalize(currentWidth);

    }

    return {
        init: init,
        equalize: equalize,
    };

});