( function( modules ) {

var path = 'timer.ctor.js';

/**
 * A timer callback.
 * @callback Audrec~timerCallback
 * @param {integer} spent_milliseconds The number of spent milliseconds.
 * @param {integer} milliseconds_left The number of milliseconds left.
 * @param {float} percentage The progress of the current timer.
 */

/**
 * Creates a timer instance that calls a function repeatedly for a specific
 * amount of time.
 * @param {Audrec~timerCallback} callback A callback to be executed repeatedly.
 * @param {integer} [max_duration=420000] The maximum duration in
 * milliseconds (The default is 7 minutes).
 * @param {integer} [interval=50] The number of milliseconds between every
 * callback call.
 * @constructor
 * @memberof Audrec
 * @inner
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
     * @return {Audrec~Timer} The current instance.
     * @memberof Audrec~Timer
     * @inner
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
     * @return {Audrec~Timer} The current instance.
     * @memberof Audrec~Timer
     * @inner
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
     * @return {Audrec~Timer} The current instance.
     * @memberof Audrec~Timer
     * @inner
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
     * @return {Audrec~Timer} The current instance.
     * @memberof Audrec~Timer
     * @inner
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
     * @return {Audrec~Timer.STATUS} The current status.
     * @memberof Audrec~Timer
     * @inner
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
