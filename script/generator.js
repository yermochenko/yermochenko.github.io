window.addEventListener('load', function() {
	const SITE_TITLE = 'Dev Courses';
	const FAVICON_HREF = '/favicon.png';
	const FAVICON_TYPE = 'image/png';
	const MAIN_CSS_HREF = '/style/main.css';

	const favicon = function() {
		let linkNode = document.createElement('link');
		linkNode.setAttribute('rel', 'icon');
		linkNode.setAttribute('type', FAVICON_TYPE);
		linkNode.setAttribute('href', FAVICON_HREF);
		return linkNode;
	};

	const mainCss = function() {
		let linkNode = document.createElement('link');
		linkNode.setAttribute('rel', 'stylesheet');
		linkNode.setAttribute('href', MAIN_CSS_HREF);
		return linkNode;
	};

	const header = function() {
		let headerNode = document.createElement('header');
		let h1Node = document.createElement('h1');
		let aNode = document.createElement('a');
		aNode.setAttribute('href', '/');
		aNode.appendChild(document.createTextNode(SITE_TITLE));
		h1Node.appendChild(aNode);
		headerNode.appendChild(h1Node);
		return headerNode;
	};

	const content = function(body) {
		let mainNode = document.createElement('main');
		while(child = body.firstChild) {
			body.removeChild(child);
			mainNode.appendChild(child);
		}
		return mainNode;
	};

	const head = document.getElementsByTagName('head')[0];
	let headFirstChild = head.firstChild;
	head.insertBefore(favicon(), headFirstChild);
	head.insertBefore(mainCss(), headFirstChild);

	const body = document.getElementsByTagName('body')[0];
	const main = content(body);
	body.appendChild(header());
	body.appendChild(main);
});
