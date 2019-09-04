'use strict';

//config
const config = require('../config/app');

const { MenuItem } = require('../models/MenuItem');

class Cart {
	constructor() {
		this.data = {
			items: [],
			price: 0,
			discount: 0
		};
	}
	
	//Find item by id and return reference or index
	findItem(id = 0, index = false) {
		for(let i = 0, l = this.data.items.length; i < l; i++) if(this.data.items[i].id == id)
		{
			return index ? i : this.data.items[i];
		}

		return false;
	}
	
	//Add item
	addItem(item) {
		//Check if item is MenuItem
		if(!(item instanceof MenuItem))
		{
			return false;
		}

		//Check if price limit is reached
		if(this.data.price + item.Price > config.priceLimit)
		{
			return false;
		}

		//Check if item is exists
		let cartItem = this.findItem(item.id);
		
		//Exists, increase qty
		if(cartItem !== false)
		{
			cartItem.Qty++;
		}
		//Not exists, add it
		else
		{
			item.Qty = 1;
			this.data.items.push(item);
		}

		//Re-Calculate price
		this.calcPrice();

		//Add discount
		if(this.data.price >= config.discountPrice && this.data.items.length > 1)
		{
			this.data.discount = discountPercent;
		}
	}

	//Remove item
	removeItem(id) {
		let index = this.findItem(id, true);
		if(index !== false)
		{
			this.data.items.splice(index, 1);
			this.calcPrice();
		}
	}

	//Reduce an item qty
	reduceItem(id) {
		let cartItem = this.findItem(id);
		if(cartItem !== false && cartItem.Qty > 1)
		{
			cartItem.Qty--;
			this.calcPrice();
		}
	}

	//Get total price
	getPrice() {
		return parseInt(this.data.price - (this.data.price * (this.data.discount / 100)));
	}

	//Calculate price
	calcPrice() {
		let price = 0;
		for(let i = 0, l = this.data.items.length; i < l; i++)
		{
			price += this.data.items[i].Price * this.data.items[i].Qty;
		}

		this.data.price = price;
	}
}

module.exports = Cart;