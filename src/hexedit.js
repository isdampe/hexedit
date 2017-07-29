function hexEditor(config) {

	var he = this;
	this.rawBuffer;
	this.stringBuffer = "00";
	this.buffer = new DataView(new ArrayBuffer());
	this.bufferSize = 0;
	this.cursorPosition = 0;
	this.bytePosition = 0;

	this.config = {
		debug: false
	};

	if ( typeof config == 'undefined' ) 
		config = {};

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

	this.els = {};

	this.keyBindings = {
		inputKeys: '0123456789ABCDEF'.split(""),
		navKeys: [37, 38, 39, 40],
		deleteKeys: ["backspace"]
	};

	this.init(config);

}

hexEditor.prototype.init = function(config) {

	//Override the default config values.
	for ( key in config ) {
		if ( config.hasOwnProperty(key) ) {
			this.config[key] = config[key];
		}
	}

	this.els = {
		editor: document.getElementById('hex-editor'),
		editorContainer: document.getElementById('hex-editor-container'),
		cursor: document.getElementById('hex-cursor'),
		searchHighlight: document.getElementById('hex-search-highlight'),
		openFile: document.getElementById('hex-file-open-input'),
		dataTypes: {
			byte: document.getElementById('hex-data-type-byte'),
			short: document.getElementById('hex-data-type-short'),
			int: document.getElementById('hex-data-type-int'),
			long: document.getElementById('hex-data-type-long')
		}
	};

	document.addEventListener('keydown', function(e) {
		he.routeKey(e);
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

};

