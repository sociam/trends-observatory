package sociam.observatory.trends.storage;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import sociam.observatory.trends.TrendingTopics;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;

public class MongoReader {

    private DBCollection collection;

	public MongoReader(MongoConnection conn, String collName) {
		collection = conn.getCollection(collName);
	}

	public List<TrendingTopics> findAll() {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		DBCursor cursor = collection.find();
		while (cursor.hasNext()) {
			out.add(MongoUtils.DBObjectToTrendingTopics(cursor.next()));
		}
		return out;
	}

	/*
	 * @param source can be one of "Twitter", "Google", "Yahoo"
	 */
	public List<TrendingTopics> findBySource(String source) {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		BasicDBObject sourceObj = new BasicDBObject();
	    sourceObj.put("source", source);
		DBCursor cursor = collection.find(sourceObj);
		while (cursor.hasNext()) {
			out.add(MongoUtils.DBObjectToTrendingTopics(cursor.next()));
		}
		return out;
	}

	/*
	 * @param location can be one of "Worldwide", "United States", "United Kingdom", "London, United Kingdom", "Washington, United States" 
	 */
	public List<TrendingTopics> findByLocation(String location) {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		BasicDBObject locObj = new BasicDBObject();
	    locObj.put("location", location);
		DBCursor cursor = collection.find(locObj);
		while (cursor.hasNext()) {
			out.add(MongoUtils.DBObjectToTrendingTopics(cursor.next()));
		}
		return out;
	}
	
	/*
	 * @param from is the starting date from which to retrieve trends
	 * @param to is the end date to which to retrieve trends 
	 */
	public List<TrendingTopics> findByDate(Date from, Date to) {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		BasicDBObject obj = new BasicDBObject();
		BasicDBObject range = new BasicDBObject();
		range.put("$gte", from);
		range.put("$lt", to);
	    obj.put("timestamp", range);
		DBCursor cursor = collection.find(obj);
		while (cursor.hasNext()) {
			out.add(MongoUtils.DBObjectToTrendingTopics(cursor.next()));
		}
		return out;
	}
	
	/*
	 * @param filter is a Map of {"source":s, "location":l, "timestamp":t} with the options from corresponding find functions and comparisons as allowed by mongo 
	 */
	public List<TrendingTopics> findByMix(Map<String, Object> filter) {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		BasicDBObject obj = new BasicDBObject();
		for (String key : filter.keySet()) {
			Object value = filter.get(key); 
			if (value instanceof String) {
				obj.put(key, filter.get(key));				
			} else if (value instanceof Map) {
				Map<String, Object> mapValue = (Map<String, Object>)value;
				BasicDBObject map = new BasicDBObject();
				for (String mapKey : mapValue.keySet()) {
					map.put(mapKey, mapValue.get(mapKey));
				}
				obj.put(key, map);
			}
		}
		DBCursor cursor = collection.find(obj);
		while (cursor.hasNext()) {
			out.add(MongoUtils.DBObjectToTrendingTopics(cursor.next()));
		}
		return out;
	}

	public static void main(String[] args) throws UnknownHostException {
		MongoConnection connection = new MongoConnection("mdb-001.ecs.soton.ac.uk", "trends", "trends", "trends");
		connection.connect();
		MongoReader reader = new MongoReader(connection, "trending");
		
//		System.out.println("All: "+reader.findAll().size());
		
//		System.out.println("Yahoo: "+reader.findBySource("Yahoo").size());
//		System.out.println("Google: "+reader.findBySource("Google").size());
//		System.out.println("Twitter: "+reader.findBySource("Twitter").size());

//		System.out.println("Worldwide: "+reader.findByLocation("Worldwide").size());
//		System.out.println("UK: "+reader.findByLocation("United Kingdom").size());
//		System.out.println("US: "+reader.findByLocation("United States").size());
//		System.out.println("London: "+reader.findByLocation("London, United Kingdom").size());
//		System.out.println("Washington: "+reader.findByLocation("Washington, United States").size());

//		Calendar cal = Calendar.getInstance();
//		cal.clear();
//		cal.set(2014, 10, 12, 0, 0, 0);
//		Date from = cal.getTime();
//		Date to = new Date();
//		System.out.println("Today: "+reader.findByDate(from, to).size());
	}

}
