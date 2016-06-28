var postcss = require( 'postcss' );
var selectorParser = require( 'postcss-selector-parser' );
var loaderUtils = require( 'loader-utils' );
var assign = require( 'object-assign' );
var autoprefixer = require( 'autoprefixer' );

function isObject( val ) {
	return val && typeof val === 'object'
}

var addId = postcss.plugin( 'add-id', function( opts ) {
	return function( root ) {
		root.each( function rewriteSelector( node ) {
			if (!node.selector) {
				// handle media queries
				if (node.type === 'atrule' && node.name === 'media') {
					node.each( rewriteSelector )
				}
				return
			}
			node.selector = selectorParser( function( selectors ) {
				selectors.each( function( selector ) {
					var node = null
					selector.each( function( n ) {
						if (n.type !== 'pseudo')
							node = n
					} )
					selector.insertAfter( node, selectorParser.attribute( {
						attribute: opts.id
					} ) )
				} )
			} ).process( node.selector ).result
		} )
	}
} )

module.exports = function( content, map ) {
	this.cacheable();

	var cb = this.async();

	var query = loaderUtils.parseQuery( this.query );
	var options = this.options.regularjs || {};

	var autoprefixOptions = options.autoprefixer
	var postcssOptions = options.postcss

	// postcss plugins
	var plugins
	if (Array.isArray( postcssOptions )) {
		plugins = postcssOptions
	} else if (typeof postcssOptions === 'function') {
		plugins = postcssOptions.call( this, this )
	} else if (isObject( postcssOptions ) && postcssOptions.plugins) {
		plugins = postcssOptions.plugins
	}
	plugins = plugins ? plugins.slice() : [] // make sure to copy it

	// scoped css
	if (query.scoped) {
		plugins.push( addId( {
			id: query.id
		} ) )
	}

	// autoprefixer
	if (autoprefixOptions !== false) {
		autoprefixOptions = assign(
			{},
			// also respect autoprefixer-loader options
			this.options.autoprefixer,
			autoprefixOptions
		)
		var autoprefixer = require( 'autoprefixer' )( autoprefixOptions )
		plugins.push( autoprefixer )
	}

	postcss( plugins )
		.process( content )
		.then( function( result ) {
			cb( null, result.css );
		} )
		.catch( function() {
			console.log( e );
			cb( e );
		} )
};
