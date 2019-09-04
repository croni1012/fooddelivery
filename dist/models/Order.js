'use strict';

const { Model } = require('objection');
const { User } = require('../models/User');

class Order extends Model {
  	static get tableName() {
		return 'Orders';
	};
	
	static relationMappings = {
		User: {
		  relation: Model.BelongsToOneRelation,
		  modelClass: User,
		  join: {
			from: 'Orders.UserId',
			to: 'Users.id'
		  }
		}
	}
}

module.exports = { Order };