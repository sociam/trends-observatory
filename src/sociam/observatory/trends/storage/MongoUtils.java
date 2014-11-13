package sociam.observatory.trends.storage;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.TrendingTopic;
import sociam.observatory.trends.TrendingTopics;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class MongoUtils {
	
	public static DBObject trendingTopicsToDBObject(TrendingTopics topics) {
		DBObject out = new BasicDBObject();
		out.put("source", topics.getSource());
		out.put("timestamp", topics.getTimestamp());
		out.put("location", topics.getLocation());
		BasicDBList trends = new BasicDBList();
		for (TrendingTopic topic : topics.getTopicCollection()) {
			trends.add(trendingTopicToDBObject(topic));
		}
		out.put("trends", trends);
		return out;
	}

	public static DBObject trendingTopicToDBObject(TrendingTopic topic) {
		DBObject out = new BasicDBObject();
		out.put("label", topic.getLabel());
		out.put("rank", topic.getRank());
		if (topic.getLink() != null) {
			out.put("link", topic.getLink().toString());
		}
		if (topic.getItems() != null && !topic.getItems().isEmpty()) {
			out.put("items", topic.getItems());
		}
		return out;
	}
	
	public static TrendingTopics DBObjectToTrendingTopics(DBObject obj) {
		String s = (String)obj.get("source");
		Date t = (Date)obj.get("timestamp");
		String l = (String)obj.get("location");
		BasicDBList list = (BasicDBList)obj.get("trends");		

		TrendingTopics out = new TrendingTopics(s, t, l);
		for (Object trendObj : list) {
			DBObjectToTrendingTopic(out, (DBObject)trendObj);
		}
		return out;
	}

	private static TrendingTopic DBObjectToTrendingTopic(TrendingTopics tts, DBObject obj) {
		String l = (String)obj.get("label");
		int r = (int)obj.get("rank");
		String lk = null;
		List<String> i = null; 
		if (obj.containsField("link")) {
			lk = (String) obj.get("link");
		}
		if (obj.containsField("items")) {
			i = new ArrayList<String>();
			i = (List<String>)obj.get("items");
		}
		return new TrendingTopic(tts, l, r, lk, i);
	}

}
