package sociam.observatory.trends.storage;

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

	private static DBObject trendingTopicToDBObject(TrendingTopic topic) {
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
	
	

}
