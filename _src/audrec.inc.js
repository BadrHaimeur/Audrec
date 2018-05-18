/*!
 * Audrec is a web audio recorder library that makes
 * it easy for a web developer to record users' voices
 * in all major modern browsers.
 *
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
