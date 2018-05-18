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
@@include('./polyfills.js')

// Utility functions:
@@include('./utilities.js')

// Constructors:
@@include('./timer.ctor.js')
@@include('./audrec.ctor.js')
@@include('./pubsub.ctor.js')

// API:
namespace.Audrec = modules.Audrec;
namespace.Audrec.millisecondsToTime = modules.utils.millisecondsToTime;
namespace.Audrec.timeToMilliseconds = modules.utils.timeToMilliseconds;

} )( this, true ); // ( namespace, debug )
