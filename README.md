# regularjs-loader

webpack loader for regularjs

## Installation

```bash
$ npm i regularjs-loader -D
```

## Usage

webpack.config.js

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	...
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
		...
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
<style lang="mcss" scoped>
	.outter {
		.inner {
			color: ;
		}
	}
</style>
<template>
	<div class="outter">
		<div class="inner">Regularjs is awesome <ui-button text="Get it"></ui-button></div>
	</div>
</template>
<script>
	import Button from './Button.rgl';

	export default {
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

	//you can also export Component Constructor here
	export default Base.extend({
		init() {
			console.log( 'Button' );
		}
	});
</script>
```

## Related

- [vue-loader](https://github.com/vuejs/vue-loader)
- [rgl-loader](https://github.com/regularjs/rgl-loader)
- [html-loader](https://github.com/webpack/html-loader)
