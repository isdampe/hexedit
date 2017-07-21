hexEditor.prototype.setCursorPosition = function(charPosition) {
	this.cursorPosition = charPosition;
	this.drawCursor(charPosition);
	this.scrollEditorToPosition(charPosition);
};

hexEditor.prototype.drawCursor = function(charPosition) {

	var pos = this.calculatePosition(charPosition);
	this.els.cursor.style.left = pos.x + 'px';
	this.els.cursor.style.top = pos.y + 'px';

};

hexEditor.prototype.scrollEditorToPosition = function(charPosition) {
	var pos = this.calculatePosition(charPosition);
	var editorScrollTop = this.els.editorContainer.scrollTop;
	var editorHeight = this.els.editorContainer.clientHeight;

	var newScroll = pos.y - (editorHeight / 2) + (this.styles.lineHeight / 2);

	this.els.editorContainer.scrollTop = newScroll;
};

hexEditor.prototype.stopCursorAnimation = function() {
	this.els.cursor.classList.remove('hex-cursor-animated');
};

hexEditor.prototype.reanimateCursor = debounce(function(){
	he.els.cursor.classList.add('hex-cursor-animated');
}, 250);

