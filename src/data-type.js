hexEditor.prototype.updateDataTypes = function() {

	var byteValue = this.readFromBuffer(this.cursorPosition, 'byte') || 0;
	var shortValue = this.readFromBuffer(this.cursorPosition, 'short') || 0;
	var intValue = this.readFromBuffer(this.cursorPosition, 'int') || 0;
	var longValue = this.readFromBuffer(this.cursorPosition, 'long') || 0;

	this.els.dataTypes.byte.innerText = byteValue.toString().lpad("0", 3);
	this.els.dataTypes.short.innerText = shortValue.toString().lpad("0", 5);
	this.els.dataTypes.int.innerText = intValue.toString().lpad("0", 12);
	this.els.dataTypes.long.innerText = longValue.toString().lpad("0", 19);

};
