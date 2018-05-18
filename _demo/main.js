( function() {
    var ui = {},
        audrec = new Audrec( {max_duration: '1:13'} );

    ui.audio_list = ( function() {
        var $records = $('#records'),
            api = {
                add: add
            };

        $records.on( 'click', '.remove.button', function() {
            var $this = $( this );
            $this.parent().remove();
        });

        function add( audio ) {
            var $audio = $(audio),
                $remove_btn = $('<button class="ui red fluid \
                    remove icon button"><i class="times icon">\
                    </i> Remove</button>'),
                $record = $('<div class="record">');
            audio.autoplay = true;
            audio.controls = true;

            $record.append( [ $audio, $remove_btn ] );
            $records.append( $record );

        }

        return api;
    } )();
    ui.audrec = (function() {
        var $audrec = $( '.audrec' ),

            $record_btn = $audrec.find( '.record.button' ),
            $pause_btn = $audrec.find( '.pause.button' ),
            $stop_btn = $audrec.find( '.stop.button' ),

            $progressbar = $audrec.find( '.progressbar' ),
            $time_label = $audrec.find('.time.label'),

    		progress = 0,
    		time = '00:00',

            api = {
                record: record,
                pause: pause,
                stop: stop,

                setProgress: setProgress,
                getProgress: getProgress,
                setTime: setTime,
                getTime: getTime,
                reset: reset,

                disable: disable,
                enable: enable,

                render: render,
                // Evvent handlers:
                onRecord: null,
                onPause: null,
                onStop: null,
            };


        // Getters and Setters :
        function setProgress( value ) {
    		progress = value;
            return api;
    	}

    	function getProgress() {
    		return progress;
    	}

    	function setTime( value ) {
    		time = value;
            return api;
    	}

    	function getTime() {
    		return time;
    	}

        function reset() {
            setTime( '00:00' );
            setProgress( 0 );
            return api;
        }


        // Binding events :
        $record_btn.on( 'click', onRecordClicked );
        $pause_btn.on( 'click', onPauseClicked );
        $stop_btn.on( 'click', onStopClicked );


        disable();

        function onRecordClicked() {
            record();
            if ( typeof api.onRecord === 'function' ) {
                api.onRecord();
            }
            return api;
        }

        function onPauseClicked() {
            pause();
            if ( typeof api.onPause=== 'function' ) {
                api.onPause();
            }
            return api;
        }

        function onStopClicked() {
            stop();
            if ( typeof api.onStop === 'function' ) {
                api.onStop();
            }
            return api;
        }

    	function record() {
    		disableRecordBtn();
    		enablePauseBtn();
    		enableStopBtn();
            return api;
    	}

    	function pause() {
    		disablePauseBtn();
    		enableRecordBtn();
    		enableStopBtn();
            return api;
    	}

        function enable() {
            enableRecordBtn();
        	disablePauseBtn();
        	disableStopBtn();
            return api;
        }

        function disable() {
            disableRecordBtn();
        	disablePauseBtn();
        	disableStopBtn();
            return api;
        }

    	function stop() {
    		disableStopBtn();
    		disablePauseBtn();
    		enableRecordBtn();
            return api;
    	}
    	// record button :
    	function disableRecordBtn() {
    		$record_btn.attr( 'disabled', 'disabled' );
    	}

    	function enableRecordBtn() {

    		$record_btn.removeAttr( 'disabled' );
    	}

    	// pause button :
    	function disablePauseBtn() {
    		$pause_btn.attr( 'disabled', 'disabled' );
    	}

    	function enablePauseBtn() {
    		$pause_btn.removeAttr( 'disabled' );
    	}

    	// stop button :
    	function disableStopBtn() {
    		$stop_btn.attr( 'disabled', 'disabled' );
    	}

    	function enableStopBtn() {
    		$stop_btn.removeAttr( 'disabled' );
    	}

    	function render() {
    		$progressbar.val( getProgress() );
    		$time_label.text( getTime() );
            return api;
    	}

    	return api;

    })();
    ui.mic = ( function() {
        var $request_btn = $( '.request.button' ),
            $dismiss_btn = $( '.dismiss.button' ),
            api = {
                request: request,
                dismiss: dismiss,
                onRequest: null,
                onDismiss: null
            };

        disableDismissBtn();

        $request_btn.on( 'click', onRequestClicked );
        $dismiss_btn.on( 'click', onDismissClicked );

        function request() {
            disableRequestBtn();
            enableDismissBtn();
            return api;
        }

        function onRequestClicked() {
            if ( typeof api.onRequest === 'function' ) {
                api.onRequest();
            }
            return api;
        }

        function dismiss() {
            enableRequestBtn();
            disableDismissBtn();
            return api;
        }

        function onDismissClicked() {
            if ( typeof api.onDismiss === 'function' ) {
                api.onDismiss();
            }
            return api;
        }

        // Request button:
        function enableRequestBtn() {
            $request_btn.removeClass( 'disabled');
        }
        function disableRequestBtn() {
            $request_btn.addClass( 'disabled');
        }

        // Dismiss button:
        function enableDismissBtn() {
            $dismiss_btn.removeClass( 'disabled');
        }
        function disableDismissBtn() {
            $dismiss_btn.addClass( 'disabled');
        }

        return api;
    } )();


    // Binding events :

    ui.mic.onRequest = function() {
        audrec.requestMic();
    };

    ui.mic.onDismiss = function() {
        audrec.dismissMic();
    };

    audrec.on( 'recording',  function(
            spent_milliseconds,
            milliseconds_left,
            percentage ) {
            console.log(spent_milliseconds);
        	ui.audrec.setTime( Audrec.millisecondsToTime( spent_milliseconds, true ) )
                .setProgress( percentage )
                .render();
    });

    audrec.on( 'microphoneAvailable', function() {
        console.log('mic available');
        ui.audrec.enable();
        ui.mic.request();
    });

    audrec.on( 'microphoneDismissed', function() {
        console.log('mic dismissed');
        ui.audrec.disable();
        ui.mic.dismiss();
    });

    audrec.on( 'error', function( error ) {
        console.log('Error: ' + error.message);
        ui.audrec.disable();
        ui.mic.dismiss();
    });

    audrec.on( 'start', function() {
        console.log('started');
        ui.audrec.record();
    });

    audrec.on('stop', function( audio, url, blob ) {
        console.log('stopped');
        ui.audio_list.add( audio );
        ui.audrec.stop().reset().render();
    });

    ui.audrec.onRecord = function() {
    	if (audrec.getStatus() === Audrec.STATUS.PAUSED) {
    		audrec.resume();
    	} else {
    		audrec.start();
    	}
    };

    ui.audrec.onPause = function() {
    	audrec.pause();
    };

    ui.audrec.onStop = function() {
    	audrec.stop();
    };



} )();
