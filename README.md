# regularjs-loader [![npm package](https://img.shields.io/npm/v/regularjs-loader.svg?style=flat-square)](https://www.npmjs.org/package/regularjs-loader)

> webpack loader for [regularjs](https://github.com/regularjs/regular)

Here is a simple example using regularjs-loader [check it out](https://github.com/fengzilong/regularjs-loader-example)

## Installation

```bash
$ npm i regularjs-loader
```

## Usage

webpack.config.js

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	// ...
	entry: './index.js',
	module: {
		loaders: [
			{
				test: /\.rgl$/,
				loader: 'regularjs'
			}
		]
	},
	regularjs: {
		loaders: {
			css: ExtractTextPlugin.extract( 'css' ),
			mcss: ExtractTextPlugin.extract( 'css!mcss' )
		}
	},
	plugins: [
		// ...
		new ExtractTextPlugin( 'app.css' )
	]
};
```

index.js

```js
import App from './App.rgl';
new App().$inject( document.body );
```

App.rgl

```html
<style>
	html {
		background-color: #F2F2F2;
	}
</style>

<style lang="mcss" scoped>
	.outter {
		.inner {
			color: #000;
		}
	}
</style>

<template>
	<div class="outter">
		<div class="inner">RegularJs is Awesome <ui-button text="get it"></ui-button></div>
	</div>
</template>

<script>
	import Button from './Button.rgl';

	// export options here
	export default {
		// shorthand for registering components in current component scope
		component: {
			'ui-button': Button,
		},
		init() {
			console.log( 'App' );
		}
	}
</script>
```

Button.rgl

```html
<template>
	<button>{ text }</button>
</template>

<script>
	import Base from 'path/to/Base.rgl';

	// or export component constructor here
	export default Base.extend({
		init() {
			console.log( 'Button' );
		}
	});
</script>
```

Try it out!

## Who is using it

- [pure](https://github.com/fengzilong/pure)

## Related

- [regularjs](https://github.com/regularjs/regular)

## Thanks

- [vue-loader](https://github.com/vuejs/vue-loader)
