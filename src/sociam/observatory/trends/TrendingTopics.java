package sociam.observatory.trends;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class TrendingTopics {
	
	private Map<Integer, TrendingTopic> topics;
	private Date timestamp;
	private String source;
	private String location;
	
	public TrendingTopics(String s) {
		source = s;
		location = "Worldwide";
		timestamp = new Date();
		topics = new HashMap<Integer, TrendingTopic>();
	}

	public TrendingTopics(String s, String l) {
		source = s;
		location = l;
		timestamp = new Date();
		topics = new HashMap<Integer, TrendingTopic>();
	}

	public TrendingTopics(String s, Date t) {
		source = s;
		timestamp = t;
		topics = new HashMap<Integer, TrendingTopic>();
	}

	public TrendingTopics(String s, Date t, String l) {
		source = s;
		timestamp = t;
		location = l;
		topics = new HashMap<Integer, TrendingTopic>();
	}
	
	public Map<Integer, TrendingTopic> getTopics() {
		return topics;
	}

	public Collection<TrendingTopic> getTopicCollection() {
		return topics.values();
	}

	public void setTopics(Collection<TrendingTopic> topics) {
		this.topics = new HashMap<Integer, TrendingTopic>();
		for (TrendingTopic tt : topics) {
			this.topics.put(tt.getRank(), tt);
		}
	}

	public void setTopics(Map<Integer, TrendingTopic> topics) {
		this.topics = topics;
	}
	
	public void addTopic(TrendingTopic topic) {
		topics.put(topic.getRank(), topic);
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	
}
