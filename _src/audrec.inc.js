/**
 * The Audrec namespace.
 * @namespace Audrec
 */
(function ( namespace, debug ) {

var modules = {};

debug = debug || true;

// Polyfills:
@@include('./polyfills.js')

// Utility functions:
@@include('./utilities.js')

// Constructors:
@@include('./timer.ctor.js')
@@include('./audrec.ctor.js')

// API:
/*
utilities :
millisecondsToTime
timeToMilliseconds

Methods :
requestMic
requestMicrophone
dismissMic
dismissMicrophone
getStatus
start
pause
resume
stop

Events :
start
recording
pause
resume
stop
microphoneAvailable
error
*/


} )( window, true ); // ( namespace, debug )
