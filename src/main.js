import App from './App.svelte';
import './theme/style.scss';
import "@simonwep/pickr/dist/themes/nano.min.css";
import {
	runWebGLDemo
} from './webgl/run';

// const app = new App({
// 	target: document.body,
// 	props: {
// 		name: 'world'
// 	}
// });

// console.log('ok')

// export default app;

runWebGLDemo();