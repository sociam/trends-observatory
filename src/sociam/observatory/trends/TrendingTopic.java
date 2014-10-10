package sociam.observatory.trends;

import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TrendingTopic {

	private String label;
	private String source;
	private int rank;
	private Date timestamp;
	private URL link; 
	private List<URL> items;
	private Location location;

	public TrendingTopic(String l, String s, int r) {
		setLabel(l);
		setSource(s);
		setRank(r);
		setTimestamp(new Date());
		setLink(null);
		setItems(new ArrayList<URL>());
		setLocation(Location.Worldwide);
	}

	public TrendingTopic(String l, String s, int r, Date t, URL u, List<URL> i, Location loc) {
		setLabel(l);
		setSource(s);
		setRank(r);
		setTimestamp(t);
		setLink(u);
		setItems(i);
		setLocation(loc);
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
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

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}
	
	public String toString() {
		return "("+location.getName()+" ["+rank+"]) "+label;
	}
}
