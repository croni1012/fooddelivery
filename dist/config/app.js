module.exports = {
  port: 3000,
  sessionTime: 86400,
  priceLimit: 20000,
  discountPrice: 10000,
  domain: 'https://localhost',
  webdir: 'web',
  knex: {
    client: 'mysql',
	connection: {
		host : 'localhost',
		user : 'root',
		password : '123456',
		database : 'food_delivery'
	}
  }
};