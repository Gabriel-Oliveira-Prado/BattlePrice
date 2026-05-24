const qs = require('querystring');
const http = require('https');

const options = {
	method: 'POST',
	hostname: 'product-search-api.p.rapidapi.com',
	port: null,
	path: '/shopping',
	headers: {
		'x-rapidapi-key': 'cb4f997d4amshc5546c89733aef0p143331jsnd8b2e8733e54',
		'x-rapidapi-host': 'product-search-api.p.rapidapi.com',
		'Content-Type': 'application/x-www-form-urlencoded'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});
// Requisição de pesquisa de preços (deve ser adicionado variáveis para aleatorizar a pesquisa)
req.write(qs.stringify({
  query: 'iphone x',
  page: '1',
  country: 'br'
}));
req.end();
