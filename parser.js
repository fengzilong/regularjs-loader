var parse5 = require('parse5');
var deindent = require('./deindent');

var splitRE = /\r?\n/g
var emptyRE = /^\s*$/

function getAttribute (node, name) {
	if (node.attrs) {
		var i = node.attrs.length
		var attr
		while (i--) {
			attr = node.attrs[i]
			if (attr.name === name) {
				return attr.value
			}
		}
	}
}

function commentScript( content ) {
	var symbol = '//'
	var lines = content.split(splitRE)
	return lines.map(function (line, index) {
		// preserve EOL
		if (index === lines.length - 1 && emptyRE.test(line)) {
		return ''
		} else {
		return symbol + (emptyRE.test(line) ? '' : ' ' + line)
		}
	})
	.join('\n')
}

function parse( content ) {
	var output = {
		template: [],
		style: [],
		script: [],
	}

	var fragment = parse5.parseFragment( content, {
		locationInfo: true
	} );

	fragment.childNodes.forEach(function( node ) {
		var tagName = node.tagName;
		var lang = getAttribute( 'lang' );
		var scoped = getAttribute( node, 'scoped' ) != null

		if( !output[ tagName ] ) {
			return;
		}

		if( tagName === 'template' ) {
			node = node.content;
		}

		var start = node.childNodes[0].__location.startOffset;
		var end = node.childNodes[ node.childNodes.length - 1 ].__location.endOffset;

		var result;
		if( tagName === 'script' ) {
			result =
				commentScript( content.slice( 0, start ) ) +
				deindent( content.slice( start, end ) ) +
				commentScript( content.slice( end ));
		} else {
			var lineOffset = content.slice(0, start).split(splitRE).length - 1
			result = deindent(content.slice(start, end))
			result = Array(lineOffset + 1).join('\n') + result
		}

		output[ tagName ].push({
			content: result,
			lang: lang,
			scoped: scoped,
		});
	});

	return output
}

module.exports = parse;
