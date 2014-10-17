package sociam.observatory.trends;

import java.util.Date;
import java.util.List;

public class TrendingTopic {

	private String label;
	private int rank;
	private String link; 
	private List<String> items;
	private String raw; //TODO add a way of storing additional raw data about the topic - can be anything
	private TrendingTopics set;

	public TrendingTopic(TrendingTopics s, String l, int r) {
		set = s;
		label = l;
		rank = r;
		set.addTopic(this);
	}

	public TrendingTopic(TrendingTopics s, String l, int r, String u, List<String> i) {
		set = s;
		label = l;
		rank = r;
		link = u;
		items = i;
		set.addTopic(this);
	}
	
	public TrendingTopics getSet() {
		return set;
	}
	
	public void setSet(TrendingTopics s) {
		set = s;
		set.addTopic(this);
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public List<String> getItems() {
		return items;
	}

	public void setItems(List<String> items) {
		this.items = items;
	}
	
	public String getSource() {
		return set.getSource();
	}
	
	public Date getTimestamp() {
		return set.getTimestamp();
	}
	
	public String toString() {
		return "["+rank+"] "+label+" (link: "+link+")";
	}
}
