![Logo](audrec.png)

## What is Audrec ?

**Audrec** is a web audio recorder library that makes it easy for a web
developer to record users' voices in all major modern browsers.

## How to use it ?

The Audrec library is pretty straightforward to use, all you need is to:

1- Include [audrec.min.js](_dist/audrec.min.js) in your project
```html
<script src="path/to/audrec.min.js" charset="utf-8"></script>
```
2- Create a new Audrec object as follows
```javascript
var recorder = new Audrec( {
     max_duration: '12:25:05', // The maximum recording duration.
     format: Audrec.FORMATS['MP3'] // The audio format.
} );
```
3- Use the following API to build something awesome :rocket:

**Static methods:**

|Syntax|Description|Return value|
|------|-----------|------------|
|Audrec. **millisecondsToTime(milliseconds[, minutes_only])**|Converts milliseconds to time format.|string|
|Audrec. **timeToMilliseconds(str)**|Converts a time string to milliseconds.|integer|

**Recorder's methods:**

|Syntax|Description|Return value|
|------|-----------|------------|
|recorder. **requestMic()**|Gets the user's permission to use the microphone.|recorder|
|recorder. **requestMicrophone()**|Gets the user's permission to use the microphone.|recorder|
|recorder. **dismissMic()**|Dismisses the user's microphone .|recorder|
|recorder. **dismissMicrophone()**|Dismisses the user's microphone .|recorder|
|recorder. **start()**|Starts the recording.|recorder|
|recorder. **pause()**|Pauses the recording.|recorder|
|recorder. **resume()**|Resumes the recording.|recorder|
|recorder. **stop()**|Stops the recording.|recorder|
|recorder. **getStatus()**|Returns the current status.|Audrec.STATUS|
|recorder. **on(type, eventHandler)**|Subscribes an event handler to a specific event type.|-|
|recorde. **off(type[, eventHandler])**|Unsubscribes an event handler or all event handlers from a specific event type.|-|

**Events:**

|Name|Description|Passed arguments|
|----|-----------|----------------|
|**microphoneAvailable**|Triggered when the user's mic is available.|[stream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)|
|**microphoneDismissed**|Triggered when the mic is dismissed.|-|
|**start**|Triggered when the recorder starts recording.|-|
|**recording**|Triggered when recording.|spent_milliseconds **{integer}**, milliseconds_left **{integer}**, percentage **{float}**|
|**pause**|Triggered when the recorder is paused.|-|
|**resume**|Triggered when the recording is resumed.|-|
|**stop**|Triggered when the recorder is stopped.|[audio_element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement), [url](https://developer.mozilla.org/en-US/docs/Web/API/DOMString), [blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) |




## Where could I learn more about Audrec ?

* [Audrec API documentation](_doc) ( [preview](https://htmlpreview.github.io/?https://github.com/BadrHaimeur/Audrec/blob/master/_doc/index.html) )
* [Audrec demo](_demo) ( [preview](https://htmlpreview.github.io/?https://github.com/BadrHaimeur/Audrec/blob/master/_demo/demo.html) )
