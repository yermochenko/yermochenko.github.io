import map from '../map.js';

window.addEventListener('load', function() {
	const SITE_TITLE = 'Dev\u00A0Courses';
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

	const findPath = function(path, node) {
		if(node && node.url) {
			let found = false;
			let isArray = Array.isArray(node.url);
			if(isArray) {
				found = node.url.some((url) => url === path);
			} else {
				found = node.url === path;
			}
			let result = {
				text: (node.abbr ? node.abbr : node.title),
			};
			if(node.abbr) {
				result.title = node.title;
			}
			if(found) {
				return [result];
			} else {
				if(node.children) {
					result.url = isArray ? node.url[0] : node.url;
					let child = null;
					for(const element of node.children) {
						child = findPath(path, element);
						if(child) {
							break;
						}
					}
					if(child) {
						return [result].concat(child);
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
		} else {
			return null;
		}
	}

	const breadcrumbs = function() {
		let path = findPath(window.location.pathname, map);
		if(path) {
			let navNode = document.createElement('nav');
			path.forEach((element, index, array) => {
				let node = null;
				if(element.url) {
					node = document.createElement('a');
					node.setAttribute('href', element.url);
				} else {
					node = document.createElement('span');
				}
				if(element.title) {
					node.setAttribute('title', element.title);
				}
				node.appendChild(document.createTextNode(element.text));
				navNode.appendChild(node);
				if(index < array.length - 1) {
					navNode.appendChild(document.createTextNode(' :: '));
				}
			});
			return navNode;
		} else {
			return null;
		}
	}

	const header = function() {
		let headerNode = document.createElement('header');
		let h1Node = document.createElement('h1');
		let aNode = document.createElement('a');
		aNode.setAttribute('href', '/index.html');
		aNode.appendChild(document.createTextNode(SITE_TITLE));
		h1Node.appendChild(aNode);
		headerNode.appendChild(h1Node);
		let navNode = breadcrumbs();
		if(navNode) {
			headerNode.appendChild(navNode);
		}
		return headerNode;
	};

	const content = function(body) {
		let mainNode = document.createElement('main');
		let child = null;
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
