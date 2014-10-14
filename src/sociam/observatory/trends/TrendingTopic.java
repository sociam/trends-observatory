package sociam.observatory.trends;

import java.net.URL;
import java.util.Date;
import java.util.List;

public class TrendingTopic {

	private String label;
	private int rank;
	private URL link; 
	private List<URL> items;
	private TrendingTopics set;

	public TrendingTopic(TrendingTopics s, String l, int r) {
		set = s;
		set.addTopic(this);
		label = l;
		rank = r;
	}

	public TrendingTopic(TrendingTopics s, String l, int r, URL u, List<URL> i) {
		set = s;
		set.addTopic(this);
		label = l;
		rank = r;
		link = u;
		items = i;
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

	public URL getLink() {
		return link;
	}

	public void setLink(URL link) {
		this.link = link;
	}

	public List<URL> getItems() {
		return items;
	}

	public void setItems(List<URL> items) {
		this.items = items;
	}
	
	public String getSource() {
		return set.getSource();
	}
	
	public Date getTimestamp() {
		return set.getTimestamp();
	}
	
	public String toString() {
		return "["+rank+"] "+label;
	}
}
