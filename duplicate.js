const MongoClient = require('mongodb').MongoClient;
const dbUrl = `mongodb://guyius:Chopa27112@ds039088.mlab.com:39088/guyius`;
let state = {db: null};

module.exports = {
	connectToDB: (done) => {
		if (state.db) return done();
		MongoClient.connect(dbUrl, function (err, client) {
			if (err) return done(err);
			const dataBase = client.db('guyius');
			state.db = dataBase.collection('streams');
			done();
		})
	},
	writeGamesToDB: (data) => {
		state.db.insert(data)
			.then((err, res) => {
				const result = res || err;
				return result;
			});
	}
};