new Vue({
	el: '#main',
	data: {
		//SocketIO client
		socket: io.connect(window.location.host),
		
		//Data from server
		user: false,
		data: {
			cart: false,
			categories: [],
			items: []
		},
		
		//Login & Register input values
		inputs: {
			email: "",
			password: "",
			password2: ""			
		},
		
		//Input for order
		orderInputs: {
			name: "",
			address: "",
			tel: ""
		},
		
		//Ui initial vals
		ui: {
			loading: true,
			page: "index",
			title: "",
			prevLink: "index",
			prevTitle: "Categories",
			error: "",
			success: ""
		}
	},
	created: function() {
		//Get response from the server
		this.socket.on('connected', r => {
			this.ui.loading = false;

			this.data.categories = r.categories;
			this.data.cart = r.cart;

			this.user = r.user;
		});

		//Cart change
		this.socket.on('cart-changed', r => {
			this.data.cart = r;
		});
	},
	computed: {
		//Cart icon visible helper
		isCartVisible: function() {
			return  this.user !== false && 
					this.data.cart !== false && 
					this.data.cart.items.length > 0 && 
					this.ui.page != 'cart' && 
					this.ui.page != 'order';
		},
		
		//Calculate total price
		cartPrice: function() {
			return parseInt(this.data.cart.price - (this.data.cart.price * (this.data.cart.discount / 100)));
		}
	},
	methods: {
		//Category show
		showCategory: function(name) {
			this.data.items = [];
			this.ui.loading = true;
			this.ui.title 	= name;

			//Get category from server
			this.socket.emit('get-category', name, r => {
				this.data.items = r;
				this.ui.loading = false;
				this.setPage("category");
			});
		},
		
		//Set page helper
		setPage: function(p) {
			this.ui.page = p;
			this.ui.prevLink = "index";
			this.ui.prevTitle = "Categories";

			//Datas which change on each page
			switch(p) {
				case 'register': 
					this.ui.title = 'Register';

					this.inputs.password = "";
					this.inputs.password2 = "";					
					break;
				case 'login': 
					this.ui.title = "Login";

					this.inputs.password = "";
					break;
				case 'cart': 
					this.ui.title = "Cart";
					break;
				case 'order': 
					this.ui.title = "Order";
					this.ui.prevLink = "cart";
					this.ui.prevTitle = "Cart";
					break;
			}
		},

		//Error & Success feedback helper
		setFeedback: function(type, text) {
			this.ui.error   = "";
			this.ui.success = "";

			this.ui[type] = text;
			setTimeout(_ => this.ui[type] = "", 2000);
		},
		
		//Do logout
		logout: function() {
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			location.reload();
		},
		
		//Do login
		login: function() {
			//Validation
			if(this.inputs.email == '' || this.inputs.password == '')
			{
				this.setFeedback('error', "Wrong email/password");
				return;
			}

			//Login request
			this.ui.loading = true;
			this.socket.emit('login', this.inputs, r => {
				this.ui.loading = false;
				if(r && r.success)
				{
					document.cookie = r.cookie;
					location.reload();

					return;
				}

				this.setFeedback('error', "Wrong email/password");
			});
		},
		
		//Do register
		register: function() {			
			//Email validation
			let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
			if(!regex.test(this.inputs.email))
			{
				this.setFeedback('error', "Wrong email");
				return;
			}

			//Password validation
			if(this.inputs.password.length < 6)
			{
				this.setFeedback('error', "Password must be at least 6 characters");
				return;
			}

			if(this.inputs.password != this.inputs.password2)
			{
				this.setFeedback('error', "Passwords do not match");
				return;
			}
			
			//Register request
			this.ui.loading = true;
			this.socket.emit('register', this.inputs, r => {
				this.ui.loading = false;
				if(r && r.success) //Success, switch page to login
				{
					this.setPage("login");
					this.setFeedback('success', "Now you can log in");

					return;
				}

				//Error, show info
				if(r && r.error && r.error == "exists")
				{
					this.setFeedback('error', "Email has already exists");
				}
				else
				{
					this.setFeedback('error', "Something went wrong");
				}
			});			
		},
		
		//Add item to cart helper
		toCart: function(id) {
			if(this.user === false)
			{
				return;
			}

			this.socket.emit('to-cart', id);
		},
		
		//Remove from cart helper
		removeCart: function(id) {
			if(this.user === false)
			{
				return;
			}

			this.socket.emit('remove-cart', id);
		},
		
		//Reduce item's qty helper
		reduceCart: function(id) {
			if(this.user === false)
			{
				return;
			}

			this.socket.emit('reduce-cart', id);
		},
		
		//Do order
		order: function() {
			//Validation
			if(this.orderInputs.name == '' || this.orderInputs.address == '' || this.orderInputs.tel == '')
			{
				this.setFeedback('error', "All fields are required");
				return;
			}

			//Order request
			this.ui.loading = true;
			this.socket.emit('order', this.orderInputs, r => {
				this.ui.loading = false;
				if(r && r.success) //Success, show info
				{
					this.setFeedback('success', "Order saved");
					setTimeout(_ => this.setPage('index'), 2000);

					return;
				}

				//Error, show info
				this.setFeedback('error', "Something went wrong");
			});
		},
		
		//Cancel order 
		cancelOrder: function() {
			this.socket.emit('cancel-order');
			this.setPage('index');
		}
	}		
});