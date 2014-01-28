/**
 * Took.js
 * Simple Timer object that can persist itself to 
 * Google Analytics, custom logging backend
 * or just the console. 
 * Depends on jQuery
 * @param {object} options Options hash
 */
var Took = function(options){
  //
  if(!options.eventName){
    throw 'Tool requires an event name!';
  }

  //hold the event name
  this.eventName = options.eventName;
  
  //default category and label if not passed in
  this.category = options.category || 'performance';
  this.label = options.label || '';

  //use a logging url if passed in
  this.logUrl = optins.logUrl || '';

  //default the duration to 0
  this.duration =  0;

  //get the start time
  this.start = this._getTimestamp();

};

/**
 * Get a timestamp
 * Uses the higher resolution performance.now()
 * if available, otherwise reverts to
 * @return {[type]} [description]
 */
Took.prototype._getTimestamp =function(){
  var ts = new Date().getTime();
  if(window.performance && window.performance.now){
    ts = window.performance.now();
  }
  return ts;
}; 

/**
 * Stop the timer
 */
Took.prototype.stop = function(){
  this.end = this._getTimestamp();
  this.duration = this.end - this.start;
};

/**
 * Simple logger function
 */
Took.prototype.log = function(){
  if(console && console.log){
    console.log('Telemetry: ' + this.get('eventName') + ' took ' + this.get('duration') + 'ms');
  }
};

/**
 * Store the timer
 * If Google Analytics is in the page, it will use that,
 * If a logUrl was pass into the constructor, it will use that
 * If neither of those, it will dump to the console.
 * @return {$.Deferred} jQuery deferred allowing chaining
 */
Took.prototype.store = function(){
  //if we have google analytics in the page, 
  //send telemetry there
  if(window.ga){
    var dfd = $.Deferred();
    window.ga('send', 'timing', this.category, this.eventName, this.duration, this.label);
    dfd.resolve();
    return dfd.promise();
  
  }else if(this.logUrl){
    //stuff into some other back-end store
    
    var data = {
      category: this.category,
      eventName: this.eventName,
      label: this.label,
      duration: this.duration,
      userAgent: window.navigator.userAgent
    };

    //fire it off
    return $.ajax({ url: this.logUrl, data: JSON.stringify(data), type: "POST", contentType: "application/json" });
  }else{

  }
}