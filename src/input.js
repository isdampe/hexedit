hexEditor.prototype.processInputKey = function(e) {

	if ( this.cursorPosition >= this.stringBuffer.length )
		return;

	this.stringBuffer = this.stringBuffer.substr(0, this.cursorPosition) +
											e.key.toUpperCase() +
											this.stringBuffer.substr(this.cursorPosition + 1);

	this.setCursorPosition(this.cursorPosition + 1);
	this.render();

};


hexEditor.prototype.processNavKey = function(e) {

	e.preventDefault();
	var futurePos;

	this.stopCursorAnimation();

	switch( e.which ) {
		case 39:
			futurePos = this.cursorPosition + 1;
			if ( futurePos <= this.stringBuffer.length )
				this.setCursorPosition( futurePos );
			break;
		case 37:
			futurePos = this.cursorPosition - 1;
			if ( futurePos >= 0 ) 
				this.setCursorPosition( futurePos );
			break;
		case 38:
			futurePos = this.cursorPosition - (this.styles.bytesPerLine * 2);
			if ( futurePos >= 0 )
				this.setCursorPosition(futurePos);
			break;
		case 40:
			futurePos = this.cursorPosition + (this.styles.bytesPerLine * 2);
			if ( futurePos > this.stringBuffer.length )
				futurePos = this.stringBuffer.length;
			this.setCursorPosition(futurePos);
			break;
	}

	this.reanimateCursor();

};

hexEditor.prototype.routeKey = function(e) {

	if ( this.keyBindings.inputKeys.indexOf(e.key.toUpperCase()) > -1 ) {
		this.processInputKey(e);
		return;
	}

	if ( this.keyBindings.navKeys.indexOf(e.which) > -1 ) {
		this.processNavKey(e);
		return;
	}

};

