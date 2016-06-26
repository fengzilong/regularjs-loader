var loaderUtils = require( 'loader-utils' );
var parse = require( './parser' );
var assign = require('object-assign');

module.exports = function( content ) {
	this.cacheable();

	var loaderContext = this;
	var filePath = this.resourcePath

	var defaultLoaders = {
		html: 'html-loader',
		css: 'style-loader!css-loader',
		js: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
	}

	var defaultLang = {
		template: 'html',
		style: 'css',
		script: 'js'
	}

	var selectorPath = require.resolve( './selector' );
	var rewriterInjectRE = /\b((css|html)(-loader)?(\?[^!]+)?)(?:!|$)/
	var loaders = assign( {}, defaultLoaders );

	function getSelectorString( type, index ) {
		return selectorPath +
			'?type=' + type +
			'&index=' + index + '!';
	}

	function ensureBang( loader ) {
		if (loader.charAt( loader.length - 1 ) !== '!') {
			return loader + '!'
		} else {
			return loader
		}
	}

	function getRewriter( type, scoped ) {
		return '';
	}

	function getLoaderString( type, part, scoped ) {
		var lang = part.lang || defaultLang[ type ]
		var loader = loaders[lang]
		var rewriter = getRewriter( type, scoped )
		if (loader !== undefined) {
			loader = ensureBang( loader ) + rewriter
			return ensureBang( loader )
		} else {
			// unknown lang, infer the loader to be used
			switch (type) {
				case 'template':
					return defaultLoaders.html + '!' + rewriter
				case 'style':
					return defaultLoaders.css + '!' + rewriter
				case 'script':
					return lang + '!'
			}
		}
	}

	function getRequireString( type, part, index, scoped ) {
		return loaderUtils.stringifyRequest( loaderContext,
			// disable all configuration loaders
			'!!' +
			// get loader string for pre-processors
			getLoaderString( type, part, scoped ) +
			// select the corresponding part from the rgl file
			getSelectorString( type, index || 0 ) +
			// the url to the actual rgl file
			filePath
		)
	}

	function getRequire( type, part, index, scoped ) {
		return 'require(' +
			getRequireString( type, part, index, scoped ) +
			')\n'
	}

	var parts = parse( content );

	var output = 'var __regular_script__, __regular_template__, __Component__;\n';

	// require script
	var script;
	if (parts.script.length) {
		script = parts.script[0];
		output += '__regular_script__ =' + getRequire( 'script', script, 0 );
	}

	// require template
	var template;
	if (parts.template.length) {
		template = parts.template[0]
		output += '__regular_template__ = ' + getRequire( 'template', template, 0 )
	}

	// find Regular
	output += 'var Regular = require( "regularjs" );\n';

	// TODO: 如果rs是组件构造函数，需要regularjs本身提供一个设置模板的方法
	output += 'var rs = __regular_script__;\n' +
		'if (rs.__esModule) rs = rs.default;\n' +
		'if( typeof rs === "object" ) {\n' +
		'	rs.template = __regular_template__;\n' +
		'	__Component__ = Regular.extend(rs);\n' +
		'	for( var i in rs.component ) {\n' +
		'		__Component__.component(i, rs.component[ i ]);\n' +
		'	}\n' +
		'}\n';

	output += 'module.exports = __Component__;';

	// console.log( 'output:', output );

	// done
	return output;
}
