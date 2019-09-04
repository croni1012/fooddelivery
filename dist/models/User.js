'use strict';

const { Model } = require('objection');

class User extends Model {
  	static get tableName() {
		return 'Users';
	}
}

module.exports = { User };