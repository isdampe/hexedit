hexEditor.prototype.loadHexString = function(hexString) {
	this.stringBuffer = hexString;
	this.setCursorPosition(0);
	this.preRender();
	this.render();
};

hexEditor.prototype.binaryStringToHex = function(buffer) {
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		x => ('00' + x.toString(16)
	).slice(-2)).join('').toUpperCase();
};

hexEditor.prototype.openLocalFile = function(e, file) {
	if ( !(window.File && window.FileReader && window.FileList && window.Blob)) {
		console.error('This browser doesnt support reading local files.');
		return;
	}

	var files = e.target.files;
	if ( files.length < 1 ) return;

	var file = files[0];
	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			he.loadHexString(he.binaryStringToHex(e.target.result));
		};
	})(file);

	// Read in the image file as a data URL.
	reader.readAsArrayBuffer(file);

};

hexEditor.prototype.bitOverride = function(charPosition, data) {

	if ( charPosition < 0 )
		return;
	if ( charPosition >= this.stringBuffer.length )
		return;

	this.stringBuffer = this.stringBuffer.substr(0, charPosition) +
		data +
		this.stringBuffer.substr(charPosition + data.length);

};
