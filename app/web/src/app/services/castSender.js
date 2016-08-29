
export default class CastSender {
	constructor(options) {

    this.session = null;
    this.namespace = 'urn:x-cast:com.google.cast.spotlist';
    this.applicationId = '45F0BB1E';
    this._playlist = null;

    this.initializeCastApi();
  }

  play(playlist) {
    var self = this;
    self._playlist = playlist;
		chrome.cast.requestSession(this.onRequestSessionSuccess.bind(this), this.onLaunchError);
  }

  sendMessage(message) {
    var self = this;
    console.log(message, self.session);
    if (self.session !== null) {
      self.session.sendMessage(this.namespace, message, this.onSuccess.bind(this), this.onError);
    } else {
      console.log('sendMessage:error');
    }
  }


	onRequestSessionSuccess(e) {
    var self = this;

		console.log('onRequestSessionSuccess', e);
		self.session = e;

    setTimeout(function() {
      self.sendMessage(self._playlist);
    }, 5000);

    // Default receiver no longer supports Youtube IDs. :(
		// var mediaInfo = new chrome.cast.media.MediaInfo('HHP5MKgK0o8');
		// var request = new chrome.cast.media.LoadRequest(mediaInfo);
		// self.session.loadMedia(request,
		// 	onMediaDiscovered.bind(this, 'loadMedia'),
		// 	self.onMediaError
		// );

		function onMediaDiscovered(how, media) {
			currentMedia = media;
		}
	}

	onMediaError(e) {
		console.log('onLaunchError', e);
	}

	onLaunchError(e) {
		console.log('onLaunchError', e);
	}

	sessionListener() {
		console.log('sessionListener');
	}

	receiverListener(e) {
		console.log('receiverListener', e);
		if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
			console.log('avail');
		}
	}

	onInitSuccess() {
		console.log('onInitSuccess');
	}

	onSuccess() {
		console.log('onSuccess');
	}

	onError() {
		console.log('onError');
	}

	initializeCastApi() {
		console.log('cast:init');
	  var sessionRequest = new chrome.cast.SessionRequest(this.applicationId);
	  var apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
	    this.sessionListener,
	    this.receiverListener
    );
	  chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
	}

	// if (chrome.cast || chrome.cast.isAvailable) {
	//   setTimeout(initializeCastApi, 1000);
	// }
}