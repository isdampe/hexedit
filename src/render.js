hexEditor.prototype.calculatePosition = function(charPosition) {

	//Get line number.
	var lineNumber = 1;
	if ( charPosition + 1 > (this.styles.bytesPerLine * 2) ) {
		lineNumber = Math.floor( (charPosition) / (this.styles.bytesPerLine *2) );
		lineNumber += 1;
	}

	var le = 0;

	//Calculate X
	le = charPosition; 

	if ( charPosition +1 > (this.styles.bytesPerLine * 2) ) {
		le = le - (lineNumber -1) * (this.styles.bytesPerLine * 2);
	}

	var spaces = Math.floor(le / 2);

	var x = this.styles.cursorWidth +  this.styles.linePaddingLeft +
		(this.styles.charWidth * le) + (spaces *
			this.styles.wordSpacingWidth);

	//Calculate Y
	var y = this.styles.linePaddingTop + ((lineNumber -1) *
		this.styles.lineHeight);

	return {
		x: x,
		y: y
	};

};

hexEditor.prototype.preRender = function() {

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

	//Determine character width
	data.style.padding = '0';
	var charWidth = parseFloat(data.clientWidth,10);
	var charsPerLine = lineWidth / charWidth;

	//Determine word spacing width
	data.innerText = "0 0";
	var wordSpacingWidth = parseFloat(getComputedStyle(data).width, 10) - (charWidth * 2);

	//Determine bytes per line
	var bytesPerLine = Math.floor( lineWidth / ( (charWidth * 2) + wordSpacingWidth ) );

	var lineTotal = ((this.stringBuffer.length / 2) / bytesPerLine) + linePaddingTop;
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
	
	//Set the minimum height for scroll.
	this.els.editor.style.minHeight = this.styles.editorHeight + "px";

};


hexEditor.prototype.render = function() {

	const PAINT_OVERFLOW_LINES = 4;

		//Get scroll top.
	var virtualScrollTop = this.els.editorContainer.scrollTop;
	if ( virtualScrollTop < 0 )
		virtualScrollTop = 0;

	//Clear the current editor drawing.
	while ( this.els.editor.firstChild ) {
		this.els.editor.removeChild(this.els.editor.firstChild);
	}

	var firstVisibleLine = Math.floor(virtualScrollTop / this.styles.lineHeight)
												 - PAINT_OVERFLOW_LINES;
  if ( firstVisibleLine < 0 ) firstVisibleLine = 0;

	var charPosition = firstVisibleLine * (this.styles.bytesPerLine * 2);
  if ( charPosition < 0 ) charPosition = 0;

	var y = (firstVisibleLine * this.styles.lineHeight);

	var maxPosition = charPosition + ( this.styles.bytesPerLine *
		this.styles.editorLinesVisible * 2) +
		(this.styles.bytesPerLine * PAINT_OVERFLOW_LINES * 2);

	if ( maxPosition > this.buffer.byteLength ) 
		maxPosition = this.buffer.byteLength;

	while ( charPosition < maxPosition ) {
		let line = document.createElement('div');
		line.className = 'line';
		line.style.position = "absolute";
		line.style.top = y + 'px';

		let data = document.createElement('div');
		data.className = "data";

		let lb = this.readBytesAsHex(charPosition, this.styles.bytesPerLine) + " ";
    charPosition += this.styles.bytesPerLine;
		data.innerText = lb;

		line.appendChild(data);
		this.els.editor.appendChild(line);
		y += this.styles.lineHeight;

	}

};

hexEditor.prototype.highlightRegion = function(charPositionStart, charPositionEnd) {

	var posStart = this.calculatePosition(charPositionStart);
  posStart.x -= (this.styles.charWidth / 2);
	posStart.y -= (this.styles.linePaddingTop);

	var posEnd = this.calculatePosition(charPositionEnd);
	var width = Math.abs( posStart.x - posEnd.x );
  var height = this.styles.lineHeight;

	this.els.searchHighlight.style.left = posStart.x + 'px';
	this.els.searchHighlight.style.top = posStart.y + 'px';
	this.els.searchHighlight.style.width = width + 'px';
	this.els.searchHighlight.style.height = height + 'px';

};

