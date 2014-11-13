package sociam.observatory.trends.storage;

import sociam.observatory.trends.TrendingTopics;

import com.mongodb.DBCollection;
import com.mongodb.MongoException;

public class MongoWriter {

	private DBCollection collection;

	public MongoWriter(MongoConnection conn, String collName) {
		collection = conn.getCollection(collName);
	}

	public boolean write(TrendingTopics topics) {
		try {
			collection.insert(MongoUtils.trendingTopicsToDBObject(topics));
			return true;
		} catch (MongoException ex) {
			ex.printStackTrace();
		}
		return false;
	}

}
