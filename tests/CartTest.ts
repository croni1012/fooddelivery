const assert = require('assert');
const config = require('../dist/config/app');
const Cart = require('../dist/js/Cart.class');

//db
const { Model } = require('objection');
const { MenuItem } = require('../dist/models/MenuItem');

Model.knex(require('knex')(config.knex));

describe('Add item to cart test:', function() {
    it('Not MenuItem added', function() {
        let cart = new Cart();
		let resp = cart.addItem(4);
		assert(resp === false);
    });

	it('Price limit reached correctly', async function() {
        let item = await MenuItem.query().findById(17); //The price of this item is 1000
		
		let cart = new Cart();
		for(let i = 0;i < 100;i++)
		{
			cart.addItem(item);
		}
		
		
		assert(cart.data.price <= config.priceLimit);
    });

	it('Item correctly added', async function() {
        let item = await MenuItem.query().findById(1);
		
		let cart = new Cart();
		cart.addItem(item);		
		
		assert(cart.data.items[0] === item);
    });

	it('Same item stack', async function() {
        let item = await MenuItem.query().findById(1);
		
		let cart = new Cart();
		cart.addItem(item);
		cart.addItem(item);		
		
		assert(cart.data.items[0] === item && cart.data.items.length == 1);
    });
	
	
});