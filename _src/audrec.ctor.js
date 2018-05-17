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
