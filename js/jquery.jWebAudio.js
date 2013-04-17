(function ($) {
    /*** Init private variables ***/
    // jWebAudio is the singleton instance of JWebAudio.
    // Detailed in Private Classes part
    var jWebAudio = null;
    
    
    
    /*** Public jWebAudio functions for jQuery plugin ***/
    var methods = {
        /* Create new Sound in `soundArray`.
         * `options`: {'url': ..., 'preLoad': ..., 'callback':..., 
         * 'multishot': ...}
         * Note that if there is already sound in current div,
         * it will be destroyed and a new one will be created.
         * `url`: file location of the sound
         * `preLoad`: load instantly if true, else will load when call `load`
         *            or `play`. Default false.
         * `callback`: function to be called after load, if preLoad
         * `multishot`: true if to allow play multi times with the same sound.
         *              Default false.
         * `options` also contain sound options like muted, loop...
         */
        addSoundSource: function(options) {
            return this.each(function() {
                if (typeof options !== 'object' || 
                        !options.hasOwnProperty('url')) {
                    $.error('Error url in addSoundSource.');
                    return;
                }
                if (methods.existsSound.call($(this))) {
                    console.warn('Sound already exists. It will be '
                            + 'destroyed now.');
                    methods.destroySound.call($(this));
                }
                if (typeof options.multishot !== 'boolean') {
                    options.multishot = false;
                }
                
                var id = jWebAudio.soundArray.length;
                $(this).data('soundId', id);
                jWebAudio.soundArray.push({
                    'element': $(this),
                    'url': options.url,
                    'isLoaded': false,
                    'sound': null,
                    'multishot': options.multishot,
                    
                    // only used to load audio, sound options like muted...
                    'options': options
                });
                
                if (typeof options === 'object' && options.preLoad === true) {
                    new WebAudioLoader(id, options.callback);
                }
            });
        },
        
        /* Stops and destroys a sound in this element.
         * This function should be called when the sound is sure to be not 
         * used again.
         * `id`: the div id called jWebAudio
         */
        destroySound: function() {
            return this.each(function() {
                var id = $(this).data('soundId');
                if (jWebAudio.soundArray[id]) {
                    if (jWebAudio.soundArray[id].isLoaded) {
                        jWebAudio.soundArray[id].stop();
                    }
                    delete jWebAudio.soundArray[id];
                    $(this).data('soundId', undefined);
                }
            });
        },
        
        /* Returns true if sound exists in current element, false otherwise */
        existsSound: function() {
            if ($(this).data('soundId') === undefined) {
                return false;
            } else {
                return true;
            }
        },
        
        /* Load content of audio  
         * `callback`: function to be called after loaded.
         */
        load: function(callback) {
            return this.each(function() {
                if ($(this).data('soundId') !== undefined) {
                    var id = $(this).data('soundId');
                } else {
                    $.error('Please call createSound first!');
                    return;
                }
                new WebAudioLoader(id, callback);
            });
        },
        
        /* Play audio */
        play: function() {
            return this.each(function() {
                var id = $(this).data('soundId');
                var sound = getSound(id);
                if (sound.isLoaded === false) {
                    $.error('Please call load first!');
                } else {
                    sound.sound.play();
                }
            });
        },
        
        /* Pause if is not multishot audio.
         * Multishot audio can't be paused because they are designed to be 
         * simple short sound effects
         */
        pause: function() {
            return this.each(function() {
                var sound = getSound($(this).data('soundId'));
                if (sound.multishot === false) {
                    sound.sound.pause();
                }
            });
        },
        
        /* Stop audio */
        stop: function() {
            return this.each(function() {
                var sound = getSound($(this).data('soundId'));
                sound.sound.stop();
            });
        },
        
        /* Seek position */
        seek: function() {
            var sound = getSound($(this).data('soundId'));
            var position = arguments[0];
            if (sound.sound.options.multishot) {
                $.error('You cannot call seek with multishot sound!')
                return;
            }
            if (arguments[0] === undefined) {
                // Get
                return sound.sound.offset;
            } else {
                // Set
                return this.each(function() {
                    sound.sound.seek(position);
                });
            }
        },
        
        /* Get duration (total length of the audio) */
        duration: function() {
            var sound = getSound($(this).data('soundId'));
            if (sound.sound.options.multishot) {
                $.error('You cannot get duration with multishot sound!')
                return;
            }
            return sound.sound.duration;
        },
        
        /* Get effect array or 
         * add effect which returns the id in effect array
         */
        effect: function() {
            var sound = getSound($(this).data('soundId'));
            if (arguments[0] === undefined) {
                // Get effect array
                return sound.sound.getEffects();
            } else {
                // Set effect
                var name = arguments[0];
                return sound.sound.addEffect(new Effect(name));
            }
        },
        
        /* Delete effect with given index in effect array
         * id can either be an int or an array of int
         */
        deleteEffect: function(id) {
            return this.each(function() {
                var sound = getSound($(this).data('soundId'));
                if (typeof id === 'number') {
                    sound.sound.deleteEffect(id);
                } else if (typeof id === 'object') {
                    for (var i in id) {
                        sound.sound.deleteEffect(id[i]);
                    }
                }
            });
        },
        
        /* Get instance of 3D Effect */
        get3dEffect: function(id) {
            var sound = getSound($(this).data('soundId'));
            if (typeof id === 'number') {
                var effect = sound.sound.getEffect(id);
                if (effect.getName() === '3d') {
                    return effect;
                } else {
                    $.error('Effects other than 3D cannot be set position!');
                }
            } else {
                $.error('Error type in set3dEffectPosition!');
            }
        },
        
        /* Clear all effects */
        clearAllEffects: function() {
            return this.each(function() {
                var sound = getSound($(this).data('soundId'));
                if (sound.sound.options.multishot) {
                    $.error('You cannot clear effect with multishot sound!')
                    return;
                }
                sound.sound.clearAllEffects();
            });
        },
        
        /* Reset options in jWebAudio */
        options: function(opt) {
            if (this === window) {
                // Global options
                return this.each(function() {
                    jWebAudio.options = opt;
                });
            } else {
                // Sound options
                return this.each(function() {
                    var id = $(this).data('soundId');
                    var sound = getSound(id);
                    sound.sound.options = opt;
                });
            }
        }
    };
    
    
    
    /*** jQuery plugin facade ***/
    $.fn.jWebAudio = function() {
        // Init only when first called
        if (jWebAudio === null) {
            jWebAudio = new JWebAudio(options);
            if (window.hasOwnProperty('AudioContext')) {
                jWebAudio.context = new AudioContext();
            } else if (window.hasOwnProperty('webkitAudioContext')) {
                jWebAudio.context = new webkitAudioContext();
            } else {
                jWebAudio.context = null;
                $.error('Web audio is not supported in current ' +
                        'web browser. Please try with the latest' + 
                        ' Chrome.');
            }
        }
                
        var method = arguments[0];
        if (methods[method]) {
            // Call with given method
            if (arguments[1] === undefined) {
                // Get function
                return methods[method].call(this);
            } else {
                // Set function
                // Allow to set options or callback
                if (typeof arguments[1] === 'object') {
                    var options = $.extend({
                        callback: function() {}
                    }, arguments[1]);
                    if (typeof arguments[2] === 'function') {
                        $.extend(options, {
                            callback: arguments[2]
                        });
                    }
                } else {
                    var options = arguments[1];
                }
                return methods[method].call(this, options);
            }
        } else if (typeof method === 'object' || !method) {
            // Calls init if no method is given
            // Allow to set options or callback
            var options = $.extend({
                callback: function() {}
            }, arguments[0] || {});
            if (typeof arguments[1] === 'function') {
                $.extend(options, {
                    callback: arguments[1]
                });
            }
            return methods.init.call(this, options);
        } else {
            // Error if no method is matched
            $.error('Method ' + method + 
                    ' does not exist on jquery.jWebAudio');
        }
    };
    // Allow to use $.jWebAudio(...) instead of $(window).jWebAudio(...)
    $.jWebAudio = function() {
        return $(window).jWebAudio.apply($(window), 
                Array.prototype.slice.call(arguments, 0));
    };
    
    
    
    /*** Private functions ***/
    /* Make Child class extends Parent class */
    function extend(Child, Parent) {
        var F = function(){};

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;

        Child.uber = Parent.prototype;
    }
    
    /* Merge right into left with properties existing in left */
    function leftMerge(left, right) {
        for (var i in right) {
            if (left.hasOwnProperty(i)) {
                if (typeof left[i] === 'object') {
                    if (typeof right[i] === 'object') {
                        leftMerge(left[i], right[i]);
                    } // ignore if right[i] is not object
                } else {
                    left[i] = right[i];
                }
            }
        }
    }
    
    /* Get sound in jWebAudio with given id */
    function getSound(id) {
        if (id !== undefined) {
            var sound = jWebAudio.soundArray[id];
        } else {
            $.error('Please call createSound first!');
            return;
        }
        return sound;
    }
    
    
    
    /*** Private Classes ***/
    /* JWebAudio */
    function JWebAudio(opt) {
        this.context = null;
        
        // Default options for jWebAudio
        var options = {
            'preferHTML5Audio': false
        };
        /* Get options */
        this.__defineGetter__('options', function() {
            return options;
        });
        /* Set options */
        this.__defineSetter__('options', function(arg) {
            // update only those with existing id
            leftMerge(options, arg);
        });
        
        // merge new options with default options
        leftMerge(options, opt);
        
        /* Array of instances of Sound, in the form of: 
         * [{'id': x, 'url': x, 'isLoaded': false, 'sound': x}, ...], where
         * `element` is the element called jWebAudio,
         * `url` is the sound url,
         * `isLoaded` shows if `sound` has been loaded
         * `sound` is null before loaded, and a `Sound` instance once loaded.
         * Note that elements in soundArray will set to be undefined 
         * (but the length of the array will remain the same)
         * when destroyed, so it is responsible to check before use.
         */
        this.soundArray = [];
    }
    
    /* Load by web audio
     * `id`: index in jWebAudio.soundArray 
     * Returns if is successful
     */
    function WebAudioLoader(id, callback) {
        if (jWebAudio === null) {
            $.error('Error in WebAudioLoader because web audio is not ' + 
                    'supported in current web browser.');
            return false;
        }
        var sound = jWebAudio.soundArray[id];
        if (sound === undefined) {
            $.error('Error in WebAudioLoader: sound is not defined');
            return false;
        } else if (sound.isLoaded === false) {
            var request = new XMLHttpRequest();
            var url = jWebAudio.soundArray[id].url;
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = function() {
                jWebAudio.context.decodeAudioData(
                        request.response, function(buffer) {
                            if (sound.multishot) {
                                sound.sound = 
                                        new WebAudioMultishotSound(buffer);
                            } else {
                                sound.sound = 
                                        new WebAudioSound(buffer);
                            }
                            sound.sound.options = sound.options;
                            sound.isLoaded = true;
                            if (callback !== undefined) {
                                callback();
                            }
                            return true;
                        }, function() {
                            $.error('Cannot decode: ' + url);
                            return false;
                        });
            };

            request.onerror = function() {
                $.error("Load error");
            };

            request.send();
        }
        return true;
    }
    
    /* Basic control of sound */
    function Sound() {
        // Play status
        this.STOPPED = 0;
        this.PLAYING = 1;
        this.PAUSED = 2;
        
        var self = this;
        // Default options for sound
        var options = {
            'loop': false,
            'fadein': false,
            'fadeout': false,
            'muted': false,
            'volume': 100
        };
        /* Get options */
        this.__defineGetter__('options', function() {
            return options;
        });
        /* Set options */
        this.__defineSetter__('options', function(arg) {
            if (arg) {
                if (arg.muted !== undefined && arg.muted !== options.muted) {
                    self.setMuted(arg.muted);
                }
                if (arg.volume !== undefined && arg.volume !== options.volume) {
                    self.setVolume(arg.volume);
                }
                // update only those with existing id
                leftMerge(options, arg);
            }
        });
        
        /* Set if to mute */
        this.setMuted = function(arg) {
            if (typeof arg !== 'boolean') {
                $.error('Error type of mute!');
                return;
            }
            options.muted = arg;
            if (arg) {
                gain.gain.value = 0;
            } else {
                gain.gain.value = options.volume / 100;
            }
        };

        /* Set volume */
        this.setVolume = function(arg) {
            arg = +arg;
            if (isNaN(arg)) {
                $.error('Error type of volume in setVolume');
                return;
            }
            options.volume = arg;
            gain.gain.value = arg / 100;
        };
        
        var ctx = jWebAudio.context;
        
        var gain = ctx.createGainNode();
        this.__defineGetter__('gain', function() {
            return gain;
        });
        
        var effectArr = [];
        var effectName = [];

        /* Add sound effect */
        this.addEffect = function(effect) {
            if (!(effect instanceof Effect)) {
                $.error('Error in addEffect: effect is not instance of Effect');
                return;
            }
            
            var first = firstEffect();
            var last = lastEffect();
            
            if (first !== null) {
                // Effect exists already
                last.out.connect(effect.in);
            } else {
                // First effect
                gain.disconnect();
                gain.connect(effect.in);
            }
            effect.out.connect(ctx.destination);

            effectArr.push(effect);
            effectName.push(effect.getName());
            
            return effectArr.length - 1;
        };
        
        /* Get sound names */
        this.getEffectNames = function() {
            return effectName;
        };
        
        /* Get sound effect */
        this.getEffect = function(id) {
            return effectArr[id];
        }
        
        /* Delete effect with given index */
        this.deleteEffect = function(id) {
            if (effectArr[id] !== undefined) {
                // Find the nearest left effect
                var left = null;
                for (var i = id - 1; i >= 0; --i) {
                    if (effectArr[i] !== undefined) {
                        left = effectArr[i].out;
                        break;
                    }
                }
                // Find the nearst right effect
                var right = ctx.destination;
                for (var i = id + 1; i < effectArr.length; ++i) {
                    if (effectArr[i] !== undefined) {
                        right = effectArr[i].in;
                        break;
                    }
                }
                
                if (left === null) {
                    // Connect to gain
                    gain.disconnect();
                    gain.connect(right);
                } else {
                    // Connect to left
                    left.connect(right);
                }
                
                delete effectArr[id];
                delete effectName[id];
            }
        };

        /* Clear all effects */
        this.clearAllEffects = function() {
            for (var i = effectArr.length - 1; i >= 0; --i) {
                if (effectArr[i] !== undefined) {
                    gain.disconnect();
                    effectArr[effectArr.length - 1].out.disconnect();
                    gain.connect(ctx.destination);

                    effectArr = [];
                    effectName = [];
                    return;
                }
            }
        };
        
        /* Get left-most effect that is not undefined */
        function firstEffect() {
            for (var i = 0; i < effectArr.length; ++i) {
                if (effectArr[i] !== undefined) {
                    return effectArr[i];
                }
            }
            return null;
        }
        
        /* Get right-most effect that is not undefined */
        function lastEffect() {
            for (var i = effectArr.length - 1; i >= 0; --i) {
                if (effectArr[i] !== undefined) {
                    return effectArr[i];
                }
            }
            return null;
        }

        // Init
        if (jWebAudio === null) {
            $.error('Error in Sound because web audio is not ' + 
                    'supported in current web browser.');
            return;
        }

        gain.connect(ctx.destination);
    }
    
    /* Web audio implementation of Sound class, extends Sound */
    function WebAudioSound(buffer) {
        Sound.call(this);
        
        if (jWebAudio === null) {
            $.error('Error in WebAudioSound because web audio is not ' + 
                    'supported in current web browser.');
            return;
        }
        
        var self = this; // for inner functions to call WebAudioSound
        
        var _ctx = jWebAudio.context;
        
        var _source = null;
        
        var _buffer = buffer;
        /* Get duration */
        this.__defineGetter__('duration', function() {
            return _buffer.duration;
        });
        
        var _offset = 0;
        /* Get offset */
        this.__defineGetter__('offset', function() {
            if (_state === self.PLAYING) {
                return (_ctx.currentTime - _startTime + _offset);
            }
            return _offset;
        });
        /* Seek position */
        this.seek = function(arg) {
            if (typeof arg !== 'number' || arg < 0 || arg > _buffer.duration) {
                $.error('Error arg in WebAudioSound.');
                return;
            }
            var wasPlaying = _state;
            stop();
            _offset = arg;
            // Play if was playing
            if (wasPlaying === this.PLAYING) {
                play();
            }
        };
        
        var _startTime = 0;
        
        var _state = this.STOPPED;
        /* Get state */
        this.__defineGetter__('state', function() {
            return _state;
        });
        
        var _eventQueue = {
            "play": [],
            "pause": [],
            "stop": [],
            "finish": [],
            "seek": []
        };
        
        var _finishEvent = null;
        
        // Play if was not playing
        this.play = function() {
            if (_state === self.PLAYING) {
                return;
            }
            
            play();
        };
        // Play without checking previous state
        function play() {
            var duration = _buffer.duration - _offset;

            _source = _ctx.createBufferSource();
            _source.buffer = _buffer;
            _source.loop = self.options.loop;
            _source.connect(self.gain);

            _source.noteGrainOn(0, _offset, duration);

            _startTime = _ctx.currentTime;
            _state = self.PLAYING;

            // Event fired when audio come to the end
            _finishEvent = setTimeout(function() {
                _offset = 0;
                _state = self.STOPPED;
            }, duration * 1000);
        }

        this.pause = function() {
            if (_state !== self.PLAYING) {
                return;
            }
            
            stop();
            _state = self.PAUSED;
        };

        // Stop if is not stopped
        this.stop = function() {
            if (_state === self.STOPPED) {
                return;
            }

            stop();
            _offset = 0;
            _state = self.STOPPED;
        };
        // Stop playing without checking
        // Note that is function makes the sound not playing, may either
        // caused by stopping or pausing the sound
        function stop() {
            if (_state === self.PLAYING) {
                _source.noteOff(0);
                _source = null;
            }
            _offset += (_ctx.currentTime - _startTime);

            clearTimeout(_finishEvent);
        }
    }
    // Extends Sound
    extend(WebAudioSound, Sound);
    
    /* Web audio that allows to play under multi-shot, extends Sound */
    function WebAudioMultishotSound(buffer) {
        Sound.call(this);
        
        if (jWebAudio === null) {
            $.error('Error in WebAudioMultishotSound because web audio is ' + 
                    'not supported in current web browser.');
            return;
        }
        
        var _ctx = jWebAudio.context;

        var _buffer = buffer;
        var _playedSrc = [];
        
        var self = this;

        this.play = function() {
            var src = _ctx.createBufferSource();
            src.buffer = _buffer;
            src.loop = this.loop;

            src.connect(self.gain);
            src.noteOn(0);

            _playedSrc.push(src);
        };

        this.stop = function() {
            _playedSrc.forEach(function(element) {
                element.noteOff(0);
                element.disconnect();
            });

            _playedSrc = [];
        };
    }
    // Extends Sound
    extend(WebAudioMultishotSound, Sound);
    
    /* Sound effects */
    function Effect(name) {
        if (name === 'telephonize') {
            return new Filter(name, [{
                "type": Filter.prototype.LOWPASS,
                "frequency": 2000.0
            }, {
                "type": Filter.prototype.HIGHPASS,
                "frequency": 500.0
            }]);
            
        } else if (name === 'cathedral') {
            return new Filter(name, [{
                'type': Filter.prototype.BANDPASS,
                'frequency': 3000.0
            }, {
                'type': Filter.prototype.ALLPASS,
                'frequency': 1000.0
            }]);
            
        } else if (name === '3d') {
            return new Spatiality();
            
        } else {
            $.error('Effect name: "' + name + '" not found');
        }
    }
    
    /* Sound filters, extends Effect */
    function Filter(name, arg) {
        var effectName = name;
        this.getName = function() {
            return effectName;
        };
        
        if (jWebAudio === null) {
            $.error('Error in Filter because web audio is ' + 
                    'not supported in current web browser.');
            return;
        }
        
        var i, j, configArr = [], config, filter,
            _nodes = [];

        if (arg instanceof Array) {
            configArr = arg;
        } else if (arg instanceof Object) {
            configArr.push(arg);
        } else {
            return;
        }
        
        var ctx = jWebAudio.context;
        for (i = 0; i < configArr.length; ++i) {
            config = configArr[i];
            if (config.type >= 0 && config.type <= 7) {
                filter = ctx.createBiquadFilter();
                filter.type = config.type;
                filter.frequency.value = config.frequency;
                filter.Q.value = config.Q;
                filter.gain.value = config.gain;

                _nodes.push(filter);
            }
        }

        for (i = 0; i < _nodes.length - 1; ++i) {
            j = i + 1;
            _nodes[i].connect(_nodes[j]);
        }
        
        this.__defineGetter__('in', function() {
            return _nodes[0];
        });
                
        this.__defineGetter__('out', function() {
            return _nodes[_nodes.length - 1];
        });
    }
    // Filter extends Effect
    extend(Filter, Effect);
    
    Filter.prototype.LOWPASS = 0;
    Filter.prototype.HIGHPASS = 1;
    Filter.prototype.BANDPASS = 2;
    Filter.prototype.LOWSHELF = 3;
    Filter.prototype.HIGHSHELF = 4;
    Filter.prototype.PEAKING = 5;
    Filter.prototype.NOTCH = 6;
    Filter.prototype.ALLPASS = 7;
    
    function Spatiality() {
        var ctx = jWebAudio.context;
        this.node = ctx.createPanner();
        
        var self = this;
        this.__defineGetter__('in', function() {
            return self.node;
        });
                
        this.__defineGetter__('out', function() {
            return self.node;
        });
        
        this.getName = function() {
            return '3d';
        };
    };
    extend(Spatiality, Effect);

})(jQuery);
