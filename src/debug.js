hexEditor.prototype.log = function(log_level, message) {

	message = 'hexEditor: ' + message;

	switch ( log_level ) {
		case "warn":
			if (this.config.debug == true) {
				console.warn(message);
			}
			break;
		case "error":
			console.error(message);
			break;
		default:
			if (this.config.debug == true) {
				console.log(message);
			}
			break;
	}

}
