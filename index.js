//config
const config = require('./dist/config/app');

//db
const { Model } = require('objection');
const { MenuItem } = require('./dist/models/MenuItem');
const { User } = require('./dist/models/User');
const { Session } = require('./dist/models/Session');
const { Order } = require('./dist/models/Order');

Model.knex(require('knex')(config.knex));

//server
const express = require('express');
const app = express();
const fs = require('fs');
const server = require('https').createServer({
	key: fs.readFileSync('./ssl/app.key'),
	cert: fs.readFileSync('./ssl/app.crt'),
	requestCert: false,
	rejectUnauthorized: false
}, app);

//misc
const Cart = require('./dist/js/Cart.class');

const crypto = require('crypto');
const generateSafeId = require('generate-safe-id');
const cookie = require('cookie');

//Restrict origins
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', config.domain + ':' + config.port);
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	next();
});

//Create route for frontend
app.use('/', express.static(config.webdir, { maxAge: 31536000 }));
app.get('/', function(req, res) {
	res.set({ 'content-type': 'text/html; charset=utf-8' });
	res.write(fs.readFileSync('./'+ config.webdir +'/index.html', 'utf8'));
	res.end();	
});

var Carts = {};

//Get categories
async function getCategories() {
	let pockets = await MenuItem.knex().raw('select distinct(Category) from MenuItems'),
		categories = JSON.parse(JSON.stringify(pockets))[0].map(function(el) { return el.Category; });
		
	return categories;
}

//Get cart
function getCart(user, init = false) {
	if(user === false)
	{
		return { data: false };
	}
	
	let temp = new Cart();
	if(Carts[user.id] === undefined)
	{
		if(init)
		{
			Carts[user.id] = temp;
		}
		else
		{
			return temp;
		}
	}

	return Carts[user.id];
}

//Main function
async function main() {
	//Get initial data
	var categories = await getCategories();

	//Start the server
	var io = require('socket.io').listen(server.listen(config.port, (err) => {
		if(err) throw err; 
		
		console.log('server is running on port', server.address().port);
	}));
	
	//Restrict origins
	io.set('origins', config.domain + ':' + config.port);

	//Client connected
	io.on('connection', async function(socket) {
		let cookies = cookie.parse(socket.handshake.headers.cookie),
			user = false;

		//Check if user is logged in
		if(cookies && cookies.token)
		{
			//Check session
			let session = await Session.query()
									.where('Time', '>', new Date().getTime())
									.findOne({ 'Name': cookies.token })
									.eager('User');
			//Logged
			if(session !== undefined)
			{
				user = session.User;
				delete user.Password; //Do not store in the background and send it out
			}
		}		

		//Send data to client
		socket.emit('connected', {
			categories: categories,
			user: user,
			cart: getCart(user).data
		});

		//Get category request
		socket.on('get-category', async function(name, callback) {
			let items = await MenuItem.query().where('Category', name).orderBy('Name');

			if(callback)
			{
				callback(items);
			}
		});

		//Register request
		socket.on('register', async function(data, callback) {
			let user = await User.query().findOne('Email', data.email);
			if(user !== undefined)
			{
				callback({ success: false, error: 'exists' });
				return;
			}
			
			//Encrypt password
			let hash = crypto.createHash('sha512').update(data.password).digest("hex");
			
			//Save user
			user = await User.query().insert({ Email: data.email, Password: hash });
			
			callback({ success: true });
		});

		//Login request
		socket.on('login', async function(data, callback) {
			//Encrypt password
			let hash = crypto.createHash('sha512').update(data.password).digest("hex");

			//Check user exists
			let user = await User.query().findOne({
				'Email': data.email,
				'Password': hash
			});

			//Wrong authorization
			if(user === undefined)
			{
				callback({ success: false });
				return;
			}

			//Set expire date
			let expires = new Date();
			expires.setTime(expires.getTime() + (config.sessionTime * 1000));

			//Generate uniqid
			let token = generateSafeId();

			//Create session
			let session = await Session.query().insert({ 
				Name: token, 
				Time: expires.getTime(),
				UserId: user.id
			});

			delete user.Password; //Do not store in the background and send it out
			callback({ 
				success: true,
				user: user,
				cookie: "token="+ token +"; expires="+ expires.toGMTString() +"; path=/"
			});
		});

		//Add to cart request
		socket.on('to-cart', async function(id) {
			if(user === false) 
			{
				return;
			}

			let item = await MenuItem.query().findById(id);
			if(item === undefined) 
			{
				return;
			}			

			let cart = getCart(user, true);
			cart.addItem(item);
			
			socket.emit('cart-changed', cart.data);
		});

		//Remove from cart request
		socket.on('remove-cart', async function(id) {
			if(user === false) 
			{
				return;
			}

			let cart = getCart(user, true);
			cart.removeItem(id);
			
			socket.emit('cart-changed', cart.data);
		});

		//Reduce item from cart request
		socket.on('reduce-cart', async function(id) {
			if(user === false) 
			{
				return;
			}	

			let cart = getCart(user, true);
			cart.reduceItem(id);
			
			socket.emit('cart-changed', cart.data);
		});
		
		//Order request
		socket.on('order', async function(data, callback) {
			if(user === false) 
			{
				callback({ success: false });
				return;
			}
			
			//Save order
			let cart  = getCart(user);
			let order = await Order.query().insert({ 
				UserId: user.id,
				Items: JSON.stringify(cart.data.items),
				Price: cart.getPrice(),
				Name: data.name,
				Address: data.address,
				Tel: data.tel
			});

			//Remove cart items
			delete Carts[user.id];
			socket.emit('cart-changed', new Cart().data);
			
			callback({ success: true });
		});
		
		//Cancel Order request
		socket.on('cancel-order', function() {
			if(user === false || Carts[user.id] === undefined) 
			{
				return;
			}
			
			delete Carts[user.id];
			socket.emit('cart-changed', new Cart().data);
		});
	});
}

//Start
main();