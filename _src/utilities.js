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
