var express = require('express');
var http = require('http');
var querystring = require('querystring');
var util = require('util');
var form = require('fs').readFileSync('form.html');
var app = express();


// set up handlebars view engine
// Por default, as views devem ficar num subdiretório
// chamado 'views' e a extensão dos arquivos é
// '.handlebars'.
// Layouts ficam no subdiretório 'views/layouts'.
// O layout default é 'main.handlebars'.
var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

// Carrega middleware body-parser
// app.use(require('body-parser')()); --> deprecated in Express 4.0
// De acordo com:
// http://stackoverflow.com/questions/5710358/how-to-get-post-a-query-in-express-js-node-js
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
	extended: true
}));
// app.use(express.urlencoded());

var Gpio = require('onoff').Gpio // GPIO via Javascript

// Ao invés de inicializarmos com 'out'
// usamos 'high' que é uma variante
// de 'out' que inicializa a porta com
// o valor 'high' (que em nosso caso não liga
// o relê).
fechadura = new Gpio(4, 'high');

function pause(miliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= miliseconds) { /* faça nada */ }
}


app.get('/porta', function(req, res){
	// renderiza a view 'home.handlebars'
	res.render('home');
});

app.get('/aberta', function(req, res){
	// renderiza a view 'aberta.handlebars'
	res.render('aberta');
});

app.get('/xi', function(req, res){
	// renderiza a view 'xi.handlebars'
	res.render('xi');
});

app.get('/about', function(req, res){
	// renderiza a view 'about.
	res.render('about');
});

app.post('/porta', function(req, res){
	var senha = req.body.senha;
	console.log('Recebido '+ senha);
	if (senha == "suasenha") {
		// Dá um pulso de 500 ms de duração
		///////////////////////////////////////////////
		console.log(new Date() + ': acende');
		fechadura.writeSync(0);
		console.log('espera');
		pause(500);
		console.log(new Date() + ': apaga');
		fechadura.writeSync(1);
		///////////////////////////////////////////////
		res.redirect(303, '/aberta');
	} else {
		console.log('Entrou no else');
		res.redirect(303, '/xi');
	}
});

// Minha página 404
app.use(function(req, res, next){
	res.status(404);
	// renderiza a view '404.handlebars'
	res.render('404');
});


// Minha página 500
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	// renderiza a view '500.handlebars'
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log('Servidor escutando na porta ' + app.get('port'));
});

