window.equalDiv = (function() {

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
                equalizerCSSRules+='.' + currentEqualizer.equID + i +'{height:'+currentEqualizer.lastKnownHeight+'px;}';
                currentEqualizer.hasBeenModified = false; // reset property  
            }

        }

        // style & layout
        equalizerStyleEl.textContent = equalizerCSSRules;

    }

    

    return {
        equalize: equalize,
        init: function (config) {

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

                function getEqualizerItems(equalizerContainer, equID) {
                    var
                        j=0,
                        items = equalizerContainer.querySelectorAll('[data-' + watchClass + '-watch]');
                    
                    for(; j<items.length; j++) {
                        items[j].classList.add(equID + i);
                    }
                    
                    return items;
                }
            
                function _equalizer(equalizerContainer, equID) {
                    this.equID = equID;
                    this.items = getEqualizerItems(equalizerContainer, equID);
                    this.equalizeOn = getBreakpointWidth(equalizerContainer.getAttribute('data-equalize-on') || (data.equalizeOn || 'medium'));
                    this.heightArray = [];
                    this.minHeight = equalizerContainer.getAttribute('data-' + watchClass + '-minheight') || 0;
                    this.hasBeenModified = false;
                    this.lastKnownHeight = 0;
                }

                equalizerStyleEl = document.getElementById(styleId);

                // no <style> tag? => create it!
                if (!equalizerStyleEl) {
                    equalizerStyleEl = document.createElement('style');
                    equalizerStyleEl.id = styleId;
                    document.head.appendChild(equalizerStyleEl);
                }
                
                for(; i < elements.length; i++) {
                    elementsObjArray.push( new _equalizer( elements[i], elements[i].getAttribute('data-' + watchClass) || 'equ' ) );
                }

                return elementsObjArray;

            })(equalizerElems);

            breakpointValues.map(getBreakpointWidth);
            equalize(currentWidth);

        }
    };

})();
