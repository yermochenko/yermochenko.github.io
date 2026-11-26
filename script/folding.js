window.addEventListener('load', function() {
	const foldings = document.getElementsByClassName('folding');
	for(const folding of foldings) {
		let href = folding.getAttribute('href');
		let hashIndex = href.indexOf('#');
		let id = hashIndex != -1 ? (hashIndex != href.length - 1 ? href.substring(hashIndex + 1) : href.substring(0, hashIndex)) : href;
		let block = document.getElementById(id);
		if(block) {
			block.style.display = 'none';
			folding.addEventListener('click', (event) => {
				if(block.style.display === 'none') {
					block.style.display = 'block';
				} else {
					block.style.display = 'none';
				}
				event.preventDefault();
			});
		}
	}
});