import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// ... other configurations ...
		paths: {
			base: '',
		},
		adapter: adapter()
	}
};

export default config;