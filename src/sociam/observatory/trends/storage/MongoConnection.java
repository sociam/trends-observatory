package sociam.observatory.trends.storage;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.DBAddress;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;

public class MongoConnection {
	private String host;
	private String dbname;
	private String user;
	private String pwd;
	private DB db;
	
	public MongoConnection(String host, String dbname, String user, String pwd) {
		this.host = host;
		this.dbname = dbname;
		this.user = user;
		this.pwd = pwd;
	}

	public void connect() throws UnknownHostException {
		db = Mongo.connect(new DBAddress(host, dbname)); 
		db.authenticate(user, pwd.toCharArray());
	}
	
	public DBCollection getCollection(String name) {
		if (db.collectionExists(name)) {
			return db.getCollection(name);
		} else {
			return db.createCollection(name, null);
		}
	}
	
	public void disconnect() {
		db.getMongo().close();
	}
}
