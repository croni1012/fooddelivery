'use strict';

const { Model } = require('objection');
const { User } = require('../models/User');

class Session extends Model {
  	static get tableName() {
		return 'Sessions';
	};
	
	static relationMappings = {
		User: {
		  relation: Model.BelongsToOneRelation,
		  modelClass: User,
		  join: {
			from: 'Sessions.UserId',
			to: 'Users.id'
		  }
		}
	}
}

module.exports = { Session };