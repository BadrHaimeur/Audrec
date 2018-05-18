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
