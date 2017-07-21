function hexEditor() {
	var he = this;
	this.rawBuffer;
	this.stringBuffer = "00";
	this.cursorPosition = 0;
	this.styles = {
		lineWidth: 0,
		lineHeight: 0,
		linePaddingTop: 0,
		linePaddingLeft: 0,
		lineTotal: 0,
		editorHeight: 0,
		editorLinesVisible: 0,
		charWidth: 0,
		wordSpacingWidth: 0,
		bytesPerLine: 0,
		charsPerLine: 0,
		cursorWidth: 0
	};

	this.els = {
		editor: document.getElementById('hex-editor'),
		editorContainer: document.getElementById('hex-editor-container'),
		cursor: document.getElementById('hex-cursor'),
		searchHighlight: document.getElementById('hex-search-highlight'),
		openFile: document.getElementById('hex-file-open-input')
	};

	this.keyBindings = {
		inputKeys: '0123456789abcdef'.split("")
	};

	document.addEventListener('keydown', function(e) {
		he.processKey(e, he);
	});
	this.els.openFile.addEventListener('change', function(e){
		he.openLocalFile(e, this);
	});
	this.els.editorContainer.addEventListener('scroll', function(e){
		he.render();
	});
	window.addEventListener('resize', function(e){
		he.preRender();
		he.render();
	});

	this.highlightRegion = function(charPositionStart, charPositionEnd) {

		var posStart = this.calculatePosition(charPositionStart);
		posStart.y -= (this.styles.linePaddingTop);

		var posEnd = this.calculatePosition(charPositionEnd);
		var width = Math.abs( posStart.x - posEnd.x );

		this.els.searchHighlight.style.left = posStart.x + 'px';
		this.els.searchHighlight.style.top = posStart.y + 'px';
		this.els.searchHighlight.style.width = width + 'px';

	};

	this.processInputKey = function(e) {

		this.stringBuffer = this.stringBuffer.substr(0, this.cursorPosition) + e.key + this.stringBuffer.substr(this.cursorPosition + 1);
		this.setCursorPosition(this.cursorPosition + 1);
		this.render();

	};

	this.processKey = function(e, editor) {
		e.preventDefault();

		if ( this.keyBindings.inputKeys.indexOf(e.key) > -1 ) {
			this.processInputKey(e);
			return;
		}

		var futurePos = false;

		switch( e.which ) {
			case 39:
				futurePos = editor.cursorPosition + 1;
				if ( futurePos <= this.stringBuffer.length )
					editor.setCursorPosition( futurePos );
				break;
			case 37:
				futurePos = editor.cursorPosition - 1;
				if ( futurePos >= 0 ) 
					editor.setCursorPosition( futurePos );
				break;
			case 38:
				futurePos = editor.cursorPosition - (this.styles.bytesPerLine * 2);
				if ( futurePos > 0 )
					editor.setCursorPosition(futurePos);
				break;
			case 40:
				futurePos = editor.cursorPosition + (this.styles.bytesPerLine * 2);
				if ( editor.cursorPosition == 0 )
					futurePos += 1;
				if ( futurePos > this.stringBuffer.length )
					futurePos = this.stringBuffer.length;
				editor.setCursorPosition(futurePos);
				break;
		}

	};

	this.setCursorPosition = function(charPosition) {
		this.cursorPosition = charPosition;
		this.drawCursor(charPosition);
		this.scrollEditorToPosition(charPosition);
	};

	this.drawCursor = function(charPosition) {

		var pos = this.calculatePosition(charPosition);
		this.els.cursor.style.left = pos.x + 'px';
		this.els.cursor.style.top = pos.y + 'px';

	};

	this.scrollEditorToPosition = function(charPosition) {
		var pos = this.calculatePosition(charPosition);
		var editorScrollTop = this.els.editorContainer.scrollTop;
		var editorHeight = this.els.editorContainer.clientHeight;

		var newScroll = pos.y - (editorHeight / 2) + (this.styles.lineHeight / 2);

		this.els.editorContainer.scrollTop = newScroll;
	};

	this.calculatePosition = function(charPosition) {

		//Get line number.
		var lineNumber = 1;
		if ( charPosition + 1 > (this.styles.bytesPerLine * 2) ) {
			lineNumber = Math.floor( (charPosition) / (this.styles.bytesPerLine *2) );
			lineNumber += 1;
		}
		console.log(lineNumber);

		var le = 0;

		//Calculate X
		le = charPosition; 

		if ( charPosition +1 > (this.styles.bytesPerLine * 2) ) {
			le = le - (lineNumber -1) * (this.styles.bytesPerLine * 2);
		}

		var spaces = Math.floor(le / 2);

		var x = this.styles.cursorWidth +  this.styles.linePaddingLeft + (this.styles.charWidth * le) + (spaces * this.styles.wordSpacingWidth);
		console.log(x);

		//Calculate Y
		var y = this.styles.linePaddingTop + ((lineNumber -1) * this.styles.lineHeight);
		console.log(y);

		return {
			x: x,
			y: y
		};

	};

	this.preRender = function() {

		var line = document.createElement('div');
		line.className = 'line';

		var data = document.createElement('div');
		data.className = "data";
		data.innerText = '0';

		//    line.appendChild(location);
		line.appendChild(data);
		this.els.editor.appendChild(line);

		//Determine line width
		var lineWidth = parseFloat(getComputedStyle(line).width, 10);
		var lineHeight = parseFloat(getComputedStyle(line).height, 10);

		//Determine line padding top
		var linePaddingTop = Math.round(parseFloat(getComputedStyle(data).paddingTop, 10) / 2);
		var linePaddingLeft = Math.round(parseFloat(getComputedStyle(data).paddingLeft, 10) / 2);

		var editorLinesVisible = Math.ceil(this.els.editorContainer.clientHeight / lineHeight);
		console.log(editorLinesVisible);

		//Determine character width
		data.style.padding = '0';
		var charWidth = parseFloat(data.clientWidth,10);
		var charsPerLine = lineWidth / charWidth;

		//Determine word spacing width
		data.innerText = "0 0";
		var wordSpacingWidth = parseFloat(getComputedStyle(data).width, 10) - (charWidth * 2);

		//Determine bytes per line
		var bytesPerLine = Math.floor( lineWidth / ( (charWidth * 2) + wordSpacingWidth ) );

		var lineTotal = ((this.stringBuffer.length / 2) / bytesPerLine) + this.styles.linePaddingTop;
		var editorHeight = lineTotal * lineHeight + linePaddingTop;

		//Determine cursor width
		var cursorWidth = this.els.cursor.clientWidth;

		this.els.editor.removeChild(line);

		this.styles.lineWidth = lineWidth;
		this.styles.lineHeight = lineHeight;
		this.styles.linePaddingTop = linePaddingTop;
		this.styles.linePaddingLeft = linePaddingLeft;
		this.styles.lineTotal = lineTotal;
		this.styles.editorHeight = editorHeight;
		this.styles.editorLinesVisible = editorLinesVisible;
		this.styles.charWidth = charWidth;
		this.styles.wordSpacingWidth = wordSpacingWidth;
		this.styles.bytesPerLine = bytesPerLine;
		this.styles.charsPerLine = charsPerLine;
		this.styles.cursorWidth = cursorWidth;

		//Determine location addr offset

		//Determine characters per line

		console.log(this.styles);

	};

	this.render = function() {

		//Clear the current editor drawing.
		this.els.editor.innerHTML = '';

		//Set the minimum height for scroll.
		this.els.editor.style.minHeight = this.styles.editorHeight + "px";

		//Get scroll top.
		var editorScrollTop = this.els.editorContainer.scrollTop;
		var virtualScrollTop = editorScrollTop;
		if ( virtualScrollTop < 0 )
			virtualScrollTop = 0;

		var firstVisibleLine = Math.floor(virtualScrollTop / this.styles.lineHeight) -5;

		var charPosition = firstVisibleLine * (this.styles.bytesPerLine * 2);
		var y = (firstVisibleLine * this.styles.lineHeight);

		var maxPosition = charPosition + ( this.styles.bytesPerLine * this.styles.editorLinesVisible * 2) + (this.styles.bytesPerLine * 10);
		if ( maxPosition > this.stringBuffer.length ) 
			maxPosition = this.stringBuffer.length;

		while ( charPosition < maxPosition ) {
			if ( y > this.styles.editorHeight ) {
				console.log('error: ' + y + ":" + this.styles.editorHeight);
				break;
			}
			
			let line = document.createElement('div');
			line.className = 'line';
			line.style.position = "absolute";
			line.style.top = y + 'px';

			let data = document.createElement('div');
			data.className = "data";

			let lb = "";

			//let location = document.createElement('div');
			//location.className = 'location';
			//location.innerText = "00";
			for ( var x=0; x<this.styles.bytesPerLine; x++ ) {

				let byte = this.stringBuffer.substr(charPosition, 2);
				if ( byte.length == 2 ) {
					lb += this.stringBuffer.substr(charPosition, 2) + " ";
				}

				//line.appendChild(location);
				charPosition += 2;

			}

			data.innerText = lb;
			line.appendChild(data);
			this.els.editor.appendChild(line);
			y += this.styles.lineHeight;

		}

	};

	this.openLocalFile = function(e, file) {
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

	this.binaryStringToHex = function(buffer) {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	};

	this.loadHexString = function(hexString) {
		this.stringBuffer = hexString;
		this.setCursorPosition(0);
		this.preRender();
		this.render();
	}

}

var he = new hexEditor();
he.preRender();
he.render();
he.setCursorPosition(0);
he.highlightRegion(4,12);
