package sociam.observatory.trends.storage;

import java.net.UnknownHostException;

import sociam.observatory.trends.TrendingTopics;

import com.mongodb.DB;
import com.mongodb.DBAddress;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

public class MongoWriter {
	
	private String host;
	private String dbname;
	private String user;
	private String pwd;
	private DB db;
	private DBCollection collection;
	
	public MongoWriter(String host, String dbname, String user, String pwd) {
		this.host = host;
		this.dbname = dbname;
		this.user = user;
		this.pwd = pwd;
	}

	public void connect() throws UnknownHostException {
		db = Mongo.connect(new DBAddress(host, dbname)); 
		db.authenticate(user, pwd.toCharArray());
		if (db.collectionExists("trending")) {
			collection = db.getCollection("trending");
		} else {
			collection = db.createCollection("trending", null);
		}
	}
	
	public void disconnect() {
		db.getMongo().close();
	}
	
	public boolean write(TrendingTopics topics) {
		if (db.isAuthenticated()) {
			try {
				collection.insert(MongoUtils.trendingTopicsToDBObject(topics));
				return true;
			} catch (MongoException ex) {
				return false;
			}
		}
		return false;
	}
		
}
