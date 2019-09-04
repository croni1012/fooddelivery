'use strict';

const { Model } = require('objection');

class MenuItem extends Model {
  	static get tableName() {
		return 'MenuItems';
	}
}

module.exports = { MenuItem };