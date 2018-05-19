/*!
 * @author Badr Haimeur <badr@haimeur.com>
 * @version 1.0.0
 * @license MIT
 * @see {@link https://github.com/BadrHaimeur/Audrec}
 */

/**
 * The Audrec namespace.
 * @namespace Audrec
 */
(function ( namespace, debug ) {

/**
 * Modules namespace.
 * @namespace
 * @memberof Audrec
 * @inner
 */
var modules = {};


// Polyfills:
( function( modules ) {

var path = 'polyfills.js';

// padStart() polyfill
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

} )( modules );


// Utility functions:
( function( modules ) {

var path = 'utilities.js';

/**
 * Utilities namespace.
 * @namespace
 * @memberof Audrec
 * @inner
 */
modules.utils = {};

/**
 * Throws an error string.
 * @param {object} error The error object.
 * @param {string} error.thrower The method or constructor that throws
 * the error.
 * @param {string} error.message The error's message.
 * @param {string} error.file The file path of the thrower.
 * @memberof Audrec~modules.utils
 */
function throwError( error ) {
    if ( debug === true ) {
        if (
            typeof error.thrower === 'string' &&
            typeof error.message === 'string' &&
            typeof error.file === 'string'
        ) {
            throw (
                '\nThrower: ' + error.thrower + '\n'+
                'File: .\\_src\\' + error.file + '\n' +
                'Message: ' + error.message
            );
        } else {
            throw (
                'Thrower: ' + 'throwError( error )\n'+
                'File: .\\_src\\' + path + '\n' +
                'Message: ' + 'Invalid error argument.'
            );
        }
    }
}

/**
 * Checks if the browser is Firefox or not.
 * @return {Boolean} The result of the check ( true if the browser is Firefox ).
 * @memberof Audrec~modules.utils
 */
function isFirefox() {
	return navigator.userAgent.includes('Firefox');
}

/**
 * Checks if the browser is Chrome or not.
 * @return {Boolean} The result of the check ( true if the browser is Chrome ).
 * @memberof Audrec~modules.utils
 */
function isChrome() {
	return navigator.userAgent.includes('Chrome');
}

/**
 * Converts a time string to milliseconds.
 * @param {string} str A time value (format: 'hh:mm:ss').
 * @return {integer} The time value in milliseconds.
 * @example
 * var time_in_milliseconds = Audrec.timeToMilliseconds('01:35:11');
 * @memberof Audrec~modules.utils
 */
function timeToMilliseconds( str ) {
    var pattern = /^([0-9]{1,2}\:?){1,3}$/,
        time = [],
        result = 0;

    if ( pattern.test( str ) ) {

        time = str.split( ':', 3 ).reverse();

        time.forEach( function( num, index ) {
            var number = parseInt( num );
            if ( index < 2 && number < 60 ) {
                result += number * 1000 * Math.pow( 60, index ) ;
            }

            if ( index === 2 && number < 24 ) {
                result += number * 1000 * Math.pow( 60, index ) ;
            }
        });


    } else {
        throwError ( {
            thrower: 'timeToMilliseconds( str )',
            file: path,
            message: 'Invalid argument, "str" must have a time format hh:mm:ss (ex: "1:53:40").'
        } );
    }

    return result;
};

/**
 * Converts milliseconds to time format.
 * @param {integer} milliseconds A time value in milliseconds.
 * @param {Boolean} [minutes_only=false] Forces the function to omit hours
 * part ( ex: "21:35").
 * @return {string} The time format of the passed value
 * ( format: "hh:mm:ss" or "mm:ss" ).
 * @example
 * var milliseconds_in_time = Audrec.millisecondsToTime( 5682 );
 * @memberof Audrec~modules.utils
 */
function millisecondsToTime( milliseconds, minutes_only ) {
    var pattern = /[0-9]+/,
        result = milliseconds.toString(),
        date = new Date(),
        time = [],
        theower = 'millisecondsToTime( milliseconds, minutes_only )';

    minutes_only = minutes_only || false;

    if ( typeof minutes_only !== 'boolean') {
        throwError ( {
            thrower: thrower,
            file: path,
            message: 'Invalid argument, "minutes_only" must be a boolean.'
        } );
    }

    if ( pattern.test( milliseconds ) ) {
        date.setHours(0,0,0,0);
        date.setMilliseconds( milliseconds );
        if ( minutes_only === false ) {
            time.push(date.getHours().toString().padStart(2, '0'));
        }
        time.push(date.getMinutes().toString().padStart(2, '0'));
        time.push(date.getSeconds().toString().padStart(2, '0'));


        result = time.join(':');

    } else {
        throwError ( {
            thrower: thrower,
            file: path,
            message: 'Invalid argument, "milliseconds" must be an integer.'
        } );
    }

    return result;
}

// Exports:
modules.utils.throwError = throwError;
modules.utils.isFirefox = isFirefox;
modules.utils.isChrome = isChrome;
modules.utils.timeToMilliseconds = timeToMilliseconds;
modules.utils.millisecondsToTime = millisecondsToTime;
} )( modules );


// Constructors:
( function( modules ) {

var path = 'timer.ctor.js';

/**
 * A timer callback.
 * @callback Audrec~modules~timerCallback
 * @param {integer} spent_milliseconds The number of spent milliseconds.
 * @param {integer} milliseconds_left The number of milliseconds left.
 * @param {float} percentage The progress of the current timer.
 */

/**
 * Creates a timer instance that calls a function repeatedly for a specific
 * amount of time.
 * @param {Audrec~modules~timerCallback} callback A callback to be executed
 * repeatedly.
 * @param {integer} [max_duration=420000] The maximum duration in
 * milliseconds (The default is 7 minutes).
 * @param {integer} [interval=50] The number of milliseconds between every
 * callback call.
 * @constructor
 * @memberof Audrec~modules
 * @static
 */
function Timer( callback, max_duration, interval  ) {
    if ( !(this instanceof Timer) ) {
        return ( new Timer( callback, max_duration, interval ) );
    }

	interval = interval || 50;
    max_duration = parseInt( max_duration ) || 420000;

    // Validates arguments.
    ( function() {
        var thrower = 'Timer( callback, max_duration, interval  )';

        if ( typeof callback !== 'function' ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The parameter "callback" must be a function.'
            } );
        }

        if ( typeof max_duration > 9 ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The parameter "max_duration" must be an integer greater than 9.'
            } );
        }

        if ( typeof max_duration >= interval ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The parameter "max_duration" must be an integer greater than or equal to ' + interval + '.'
            } );
        }
    } )();

    var id,
        status = Timer.STATUS.INACTIVE,
        start_time,
        fn = function() {
            if ( ( Date.now() - start_time ) < max_duration ) {

                callback(
                    // Passed milliseconds
                    Date.now() - start_time,
                    // Milliseconds left
                    max_duration - (Date.now() - start_time) ,
                    // Percentage
                    ( (Date.now() - start_time) * 100 ) / max_duration
                );

            } else {
                callback(
                    // Passed milliseconds
                    max_duration,
                    // Milliseconds left
                    0 ,
                    // Percentage
                    100
                );
                this.stop();
            }
        }.bind( this );


    /**
     * Starts counting down.
     * @return {Audrec~modules.Timer} The current instance.
     * @memberof Audrec~modules.Timer
     * @instance
     */
    function start() {
        if ( status === Timer.STATUS.INACTIVE ) {
            start_time = Date.now();
            status = Timer.STATUS.ACTIVE;
            fn();
            id = setInterval( fn, interval );
        }
    }

    /**
     * Pauses the current timer.
     * @return {Audrec~modules.Timer} The current instance.
     * @memberof Audrec~modules.Timer
     * @instance
     */
    function pause() {
        if ( status === Timer.STATUS.ACTIVE ) {
            status = Timer.STATUS.PAUSED;
            clearInterval(id);
            fn();
            start_time = Date.now() - start_time;
        }
    }

    /**
     * Continues the countdown.
     * @return {Audrec~modules.Timer} The current instance.
     * @memberof Audrec~modules.Timer
     * @instance
     */
    function resume() {
        if ( status === Timer.STATUS.PAUSED ) {
            status = Timer.STATUS.ACTIVE;
            start_time = Date.now() - start_time;
            id = setInterval( fn, interval );
            fn();
        }
    }

    /**
     * Stops the current timer.
     * @return {Audrec~modules.Timer} The current instance.
     * @memberof Audrec~modules.Timer
     * @instance
     */
    function stop() {
        if ( status !== Timer.STATUS.INACTIVE ) {
            status = Timer.STATUS.INACTIVE;
            clearInterval(id);
            if ( ( Date.now() - start_time ) < max_duration ) {
                fn();
            }
        }
    }

    /**
     * Returns the current timer's status.
     * @return {Audrec~modules.Timer.STATUS} The current status.
     * @memberof Audrec~modules.Timer
     * @instance
     */
    function getStatus() {
        return status;
    }

    // API :
    this.start = start;
    this.pause = pause;
    this.resume = resume;
    this.stop = stop;
    this.getStatus = getStatus;
}

/**
 * The timer status.
 * @enum {string}
 * @readonly
 * @static
 */
Timer.STATUS = {
    /** The timer is inactive. */
	INACTIVE: 'INACTIVE',
    /** The timer is paused. */
	PAUSED: 'PAUSED',
    /** The timer is active. */
	ACTIVE: 'ACTIVE'
};

// Exports:
modules.Timer = Timer;

} )( modules );

( function( modules ) {

var path = 'audrec.ctor.js';

/**
 * Creates a web audio recorder.
 * @param {object} settings The recorder settings.
 * @param {string} [settings.format=Audrec.FORMATS['MP3']] The audio output format.
 * @param {string} [settings.max_duration='15:00'] The maximum recording
 * duration (format: 'hh:mm:ss').
 * @example
 * var recorder = new Audrec( {
 *      max_duration: '12:25:05',
 *      format: Audrec.FORMATS['MP3']
 * } );
 * @constructor
 * @memberof Audrec
 * @borrows Audrec.Audrec#requestMicrophone as Audrec.Audrec#requestMic
 * @borrows Audrec.Audrec#dismissMicrophone as Audrec.Audrec#dismissMic
 * @borrows Audrec~modules.utils.millisecondsToTime as millisecondsToTime
 * @borrows Audrec~modules.utils.timeToMilliseconds as timeToMilliseconds
 * @borrows Audrec~modules.Pubsub#on as Audrec.Audrec#on
 * @borrows Audrec~modules.Pubsub#off as Audrec.Audrec#off
 */
function Audrec( settings ) {
    if ( !(this instanceof Audrec) ) {
        return ( new Audrec( settings ) );
    }
    settings = settings || {};

    var self = this,
        status = Audrec.STATUS.INACTIVE,
        constraints = {
            audio: true
        },
        recorder,
        timer,
        format,
        max_duration = settings.max_duration || '15:00',
        recorder_started = false, // Checks if this.start was called.
        chunks = [],
        devices = navigator.mediaDevices,
        getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ),
        time_controller,
        start_time,
        firefox_paused = false,
        time_controller,

        pubsub = new modules.Pubsub( [
            /**
            * Start event.
            * @event Audrec.Audrec~start
            */
            'start',

            /**
            * Recording event.
            * @event Audrec.Audrec~recording
            * @param {integer} spent_milliseconds The number of milliseconds
            * spent.
            * @param {integer} milliseconds_left The number of milliseconds
            * left.
            * @param {float} percentage The recording progress.
            */
            'recording',

            /**
            * Pause event.
            * @event Audrec.Audrec~pause
            */
            'pause',

            /**
            * Resume event.
            * @event Audrec.Audrec~resume
            */
            'resume',

            /**
            * Stop event.
            * @event Audrec.Audrec~stop
            * @param {HTMLAudioElement} audio_element An Html element that
            * contains the recorded audio.
            * @param {DOMString} url A local URL of the recorded audio.
            * @param {Blob} blob The raw recorded audio.
            */
            'stop',

            /**
            * Microphone available event.
            * @event Audrec.Audrec~microphoneAvailable
            * @param {MediaStream} stream The audio media stream.
            */
            'microphoneAvailable',

            /**
            * Microphone dismissed event.
            * @event Audrec.Audrec~microphoneDismissed
            */
            'microphoneDismissed',

            /**
            * Error event.
            * @event Audrec.Audrec~error
            * @param {object} error An error object.
            * @param {string} error.name The error's name.
            * @param {string} error.message The error's message.
            */
            'error',
        ] );

    // Sets default audio format
    format = settings.format || Audrec.FORMATS['MP3'];

    // Validates the audio format
    ( function() {
        var audio_format,
            supported = false,
            thrower = 'Audrec( settings )';
        for ( audio_format in Audrec.FORMATS ) {
            if  (Audrec.FORMATS.hasOwnProperty( audio_format ) ) {
                if ( Audrec.FORMATS[ audio_format ] === format ) {
                    supported = true;
                    break;
                }
            }
        }

        if ( supported === false ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The argument "settings.format" must contain an Audrec.FORMATS value.'
            } );
        }
    } )();

    // Sets the max recording duration
    max_duration = modules.utils.timeToMilliseconds( max_duration );

    // Sets a duration timer
    timer = new modules.Timer( function( spent_milliseconds,
        milliseconds_left,
        percentage ) {

            pubsub.trigger( 'recording', [
                spent_milliseconds,
                milliseconds_left,
                percentage
            ], self );

            // Firefox MediaRecorder's onpause and onresume fix.
            if ( modules.utils.isFirefox() ) {
                if ( !firefox_paused && status === Audrec.STATUS.PAUSED ) {
                    firefox_paused = true;
                    recorder.onpause();
                }

                if ( firefox_paused && status === Audrec.STATUS.RECORDING ) {
                    firefox_paused = false;
                    recorder.onresume();
                }
            }

    }.bind( self ), max_duration );

    /**
     * Gets the user's permission to use the microphone.
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function requestMicrophone() {
        if ( !recorder ) {
            status = Audrec.STATUS.INACTIVE;
            if ( devices.getUserMedia ) {
                devices.getUserMedia( constraints )
                        .then( onSuccess, onError );
            } else {
                getMedia( constraints, onSuccess, onError );
            }

        }

        return this;
    }

    /**
     * Dismisses the user's microphone .
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function dismissMicrophone() {
        var tracks;

        if (status !== Audrec.STATUS.INACTIVE) {
            self.stop();
        }

        if ( recorder ) {
            tracks = recorder.stream.getTracks();

            tracks.forEach(function( track ) {
                track.stop();
            });
            chunks = [];
            recorder = null;
            pubsub.trigger( 'microphoneDismissed', null, self);
        }

        return this;
    }

    /**
     * Starts the recording.
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function start() {
        status = Audrec.STATUS.RECORDING;

        if ( !recorder_started ) {
            recorder_started = true;
        }

        if ( recorder ) {
            if ( recorder.state === Audrec.STATUS.INACTIVE ) {
                status = Audrec.STATUS.RECORDING;

				pubsub.trigger( 'start', null, self );

                recorder.start();
                start_time = Date.now();
    			time_controller = setTimeout(function() {
    				if ( recorder.state === Audrec.STATUS.RECORDING ) {
    					recorder.stop();
    				}
    			}, (max_duration - ( Date.now() - start_time) ) + 450 );

            }
        }

        return this;
    }

    /**
     * Pauses the recording.
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function pause() {
        if ( recorder ) {
            if ( recorder.state === Audrec.STATUS.RECORDING ) {
                status = Audrec.STATUS.PAUSED;
                start_time = Date.now() - start_time;
                clearTimeout(time_controller);
                recorder.pause();
            }
        }
        return this;
    }

    /**
     * Resumes the recording.
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function resume() {
        if ( recorder ) {
            if ( recorder.state === Audrec.STATUS.PAUSED ) {
                status = Audrec.STATUS.RECORDING;
                recorder.resume();
                // Firefox MediaRecorder's onpause and onresume fix.
                if ( modules.utils.isFirefox() ) {
                    timer.resume();
                }

                start_time = Date.now() - start_time;
    			time_controller = setTimeout(function() {
    				if ( recorder.state === Audrec.STATUS.RECORDING ) {
    					recorder.stop();
    				}
    			}, (max_duration - ( Date.now() - start_time) ) + 400 );

            }

        }
        return this;
    }

    /**
     * Stops the recording.
     * @return {Audrec.Audrec} The current instance.
     * @instance
     * @memberof Audrec.Audrec
     */
    function stop() {
        if ( recorder ) {
            if ( recorder.state !== Audrec.STATUS.INACTIVE ) {
                status = Audrec.STATUS.INACTIVE;
                firefox_paused = false;
                recorder.stop();
                clearTimeout(time_controller);
                timer.stop();
            }
        }

        return this;
    }

    /**
     * Returns the current status.
     * @return {Audrec.Audrec.STATUS} The current status of the recorder.
     * @instance
     * @memberof Audrec.Audrec
     */
    function getStatus() {
        return status;
    }

    // A callback to be executed when the user gives permission
    // to access their microphone.
    function onSuccess( stream ) {

        recorder = new MediaRecorder( stream );

        pubsub.trigger( 'microphoneAvailable', [ stream ], self);

        if ( recorder_started ) {
            self.start( );
        }

        recorder.ondataavailable = function( event ) {
            chunks.push( event.data );
        }

        recorder.onstart = function() {
            status = Audrec.STATUS.RECORDING;
            timer.start();
        }

        recorder.onresume = function() {
            status = Audrec.STATUS.RECORDING;
            timer.resume();
            pubsub.trigger( 'resume', null, self );
        }
        recorder.onpause = function() {
            status = Audrec.STATUS.PAUSED;
            timer.pause();
            pubsub.trigger( 'pause', null, self );
        };

        recorder.onstop = function() {
            var blob = new Blob(chunks, {
                    'type' : format
                }),
                url = window.URL.createObjectURL( blob ),
                audio_element = new Audio( url );

            // Makes audio_element.duartion available in chrome.
			audio_element.currentTime = Number.MAX_VALUE;
			audio_element.onseeked = function() {
                audio_element.onseeked = null;
                audio_element.currentTime = 0;
			};

            status = Audrec.STATUS.INACTIVE;
            recorder_started = false;
            chunks = [];

            pubsub.trigger( 'stop', [ audio_element, url, blob ], self );

        }
    }

    // A callback to execute when it can't access microphone.
    function onError( error ) {
        var custom_error = {
            name: error.name,
            message: error.message,
        };

        if ( !custom_error.message &&
            custom_error.name === 'PermissionDeniedError' ) {
            custom_error.message = 'The access to microphone has been denied.';
        }
        pubsub.trigger( 'error', [ custom_error ], self);
    }

    // API:
    self.start = start;
    self.stop = stop;
    self.pause = pause;
    self.resume = resume;
    self.requestMicrophone = requestMicrophone;
    self.requestMic = requestMicrophone;
    self.dismissMicrophone = dismissMicrophone;
    self.dismissMic = dismissMicrophone;
    self.getStatus = getStatus;
    self.on = pubsub.on;
    self.off = pubsub.off;

}

/**
 * Audrec status.
 * @readonly
 * @enum {string}
 */
Audrec.STATUS = {
    /** The recorder is inactive. */
    INACTIVE: 'inactive',
    /** The recorder is recording. */
    RECORDING: 'recording',
    /** The recorder is paused. */
    PAUSED: 'paused'
};

/**
 * Audio formats.
 * @enum {string}
 * @example
 * var format = Audrec.FORMATS[ '3GP' ];
 */
Audrec.FORMATS = {
    /** The value is 'audio/mpeg'. */
    'MP3': 'audio/mpeg',
    /** The value is 'audio/aac'. */
    'AAC': 'audio/aac',
    /** The value is 'audio/midi'. */
    'MIDI': 'audio/midi',
    /** The value is 'audio/ogg'. */
    'OGG': 'audio/ogg',
    /** The value is 'audio/x-wav'. */
    'WAV': 'audio/x-wav',
    /** The value is 'audio/webm'. */
    'WEBM': 'audio/webm',
    /** The value is 'audio/3gpp'. */
    '3GP': 'audio/3gpp',
    /** The value is 'audio/3gpp2'. */
    '3G2': 'audio/3gpp2'
};

modules.Audrec = Audrec;

} )( modules );

( function( modules ) {

var path = 'pubsub.ctor.js';

/**
 * Creates a Publisher/Subsciber instance.
 * @param {string[]} event_types A list of event types to be supported.
 * @constructor
 * @memberof Audrec~modules
 * @static
 */
function Pubsub( event_types ) {
    if ( !(this instanceof Pubsub) ) {
        return ( new Pubsub( event_types ) );
    }

    var event_handlers = {};

    // Validates and sets the event types.
    ( function() {
        var thrower = 'Pubsub( event_types )';

        if ( event_types instanceof Array ) {
            event_types.forEach( function( event_type ) {
                if ( typeof event_type === 'string' ) {
                    event_handlers[ event_type ] = [];
                } else {
                    modules.utils.throwError( {
                        thrower: thrower,
                        file: path,
                        message: 'Invalid event type, the "event_types" items must be strings.'
                    } );
                }

            } );
        } else {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'Invalid argument, "event_types" must be an array of event types.'
            } );
        }

    } )();

    /**
     * Subscribes an event handler to a specific event type.
     * @param {string} type An event type to subscibe to ( Note:
     * The event type must be supported. )
     * @param  {function} eventHandler An event handler that listens to
     * the specified event type.
     * @memberof Audrec~modules.Pubsub
     * @instance
     */
    function on( type, eventHandler ) {
        var thrower = 'Pubsub#on( type, eventHandler )';

        if ( !type ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The "type" argument is required.'
            } );
        }

        type = type.toString();

        if ( event_handlers[ type ] instanceof Array ) {
            if ( typeof eventHandler === 'function' ) {
                event_handlers[ type ].push( eventHandler );
            } else {
                modules.utils.throwError( {
                    thrower: thrower,
                    file: path,
                    message: 'Invalid argument, "eventHandler" must be a function.'
                } );
            }

        } else {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The event type "' + type + '" does not exist.'
            } );
        }
    }

    /**
     * Unsubscribes an event handler from a specific event type.
     * @param {string} type An event type to unsubscribe from.
     * @param {function} eventHandler The event handler to be unsubscribed.
     * @memberof Audrec~modules.Pubsub
     * @instance
     */
    function off( type, eventHandler ) {
        var thrower = 'Pubsub#off( type, eventHandler )',
            handler_index;

        if ( !type ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The "type" argument is required.'
            } );
        }

        type = type.toString();

        if ( event_handlers[ type ] instanceof Array ) {

            if ( eventHandler ) {
                if ( typeof eventHandler === 'function' ) {
                    handler_index = event_handlers[ type ].indexOf(
                        event_handlers
                    );

                    if ( handler_index >= 0 ) {
                        event_handlers[ type ].splice( handler_index, 1 );
                    } else {
                        modules.utils.throwError( {
                            thrower: thrower,
                            file: path,
                            message: 'The specified event handler "eventHandler" does not exist.'
                        } );
                    }

                } else {
                    modules.utils.throwError( {
                        thrower: thrower,
                        file: path,
                        message: 'Invalid argument, "eventHandler" must be a function.'
                    } );
                }
            } else {
                event_handlers[ type ] = [];
            }


        } else {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The event type "' + type.toString() + '" does not exist.'
            } );
        }
    }

    /**
     * Fires an event.
     * @param {string} type An event type to be triggered.
     * @param {array} [args=[]] An array of arguments to be passed to the event
     * handler.
     * @param  {object} [this_value=null] The value of "this" inside the event
     * handler.
     * @memberof Audrec~modules.Pubsub
     * @instance
     */
    function trigger( type, args, this_value ) {
        var thrower = 'Pubsub#trigger( type, args, this_value )';

        this_value = this_value || null;

        if ( !type ) {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The "type" argument is required.'
            } );
        }

        type = type.toString();
        args = args || [];

        if ( event_handlers[ type ] instanceof Array ) {

            if ( args ) {

                if ( args instanceof Array ) {
                    event_handlers[ type ].forEach( function( handler ) {
                        handler.apply( this_value, args );
                    } );
                } else {
                    modules.utils.throwError( {
                        thrower: thrower,
                        file: path,
                        message: 'Invalid argument, "args" must be an array.'
                    } );
                }

            } else {
                event_handlers[ type ].forEach( function( handler ) {
                    handler();
                } );
            }

        } else {
            modules.utils.throwError( {
                thrower: thrower,
                file: path,
                message: 'The event type "' + type + '" does not exist.'
            } );
        }
    }

    // API:
    this.on = on;
    this.off = off;
    this.trigger = trigger;
}

// Exports:
modules.Pubsub = Pubsub;

} )( modules );


// API:
namespace.Audrec = modules.Audrec;
namespace.Audrec.millisecondsToTime = modules.utils.millisecondsToTime;
namespace.Audrec.timeToMilliseconds = modules.utils.timeToMilliseconds;

} )( this, true ); // ( namespace, debug )
