hexEditor.prototype.loadHexString = function(hexString) {

	this.stringBuffer = hexString;
	this.preRender();
	this.render();
	this.setCursorPosition(0);

};

hexEditor.prototype.loadArrayBuffer = function(buffer) {

	var data = new DataView(buffer);

	this.buffer = data;
	this.bufferSize = data.byteLength;
	this.preRender();
	this.render();
	this.setCursorPosition(0);
	
	console.log(this.bufferSize + " bytes");
	console.log(this.readBytesAsHex(0,2));

};



hexEditor.prototype.binaryStringToHex = function(buffer) {
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		x => ('00' + x.toString(16)
	).slice(-2)).join('').toUpperCase();
};

hexEditor.prototype.readFromBuffer = function(charPosition, dataType) {

	if ( charPosition < 0 || charPosition >= this.stringBuffer.length ) {
		this.log('warn', 'Tried to readFromBuffer out of bounds');
		return;
	}

	var length;

	switch ( dataType ) {
		case 'byte':
			length = 2;
			break;
		case 'short':
			length = 4;
			break;
		case 'int':
			length = 8;
			break;
		case 'long':
			length = 16;
			break;
	}

	var hexVal = this.stringBuffer.substr(charPosition, length);
	var decVal = parseInt('0x' + hexVal, 16);

	return decVal;

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
			he.loadArrayBuffer(e.target.result);
			he.loadHexString(he.binaryStringToHex(e.target.result));
		};
	})(file);

	// Read in the image file as a data URL.
	reader.readAsArrayBuffer(file);

	this.setCursorPosition(0);

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

hexEditor.prototype.readBytesAsHex = function(offset, numberOfBytes, addSpaces) {
	if ( typeof offset == 'undefined' ) offset = 0;
	if ( typeof numberOfBytes == 'undefined' ) numberOfBytes = 1;
  if ( typeof addSpaces == 'undefined' ) addSpaces = true;

	var result = "";
	var i = 0;

	while ( i < numberOfBytes ) {
    if ( (offset + i) > this.buffer.byteLength ) break;
    if ( offset + i < 0 ) break;

    let lb = this.buffer.getUint8(offset + i).toString(16);
    if ( lb.length < 2 ) lb = "0" + lb;
		result += lb;

    if ( addSpaces ) result += " ";
		i++;
	}

  //if ( result.substr(-1, 1) === " " ) result = result.substr(0, result.length - 1);

	return result;

}
