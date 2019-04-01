const db = require('./db/db.js');

db('SELECT * FROM posts').then(res => {
	let regArr = /src="[a-zA-Z://0-9-.]*/g;

	res.results.map((el) => {
		el.long_text = el.long_text.replace(regArr, (el) => {
			let src = el.split('/');

			return 'src="http://localhost:3004/upload/' + src[src.length-1];
		});
		
		db('UPDATE posts SET long_text=? WHERE id=?', [el.long_text, el.id]).then((el) => {
			console.log('ITEM END');
		});
	});
})