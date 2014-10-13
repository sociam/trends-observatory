package sociam.observatory.trends.twitter;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.TrendingTopic;
import twitter4j.Location;
import twitter4j.Trend;
import twitter4j.Trends;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

public class TwitterTrends {

	private Twitter twitter;
	private LocationLoader locationLoader;
	
	public TwitterTrends() {
		twitter = new TwitterFactory().getInstance();
		locationLoader = new LocationLoader("harvester.properties");
	}

	private List<TrendingTopic> getTrendsByLocation(Location loc) {
		List<TrendingTopic> out = new ArrayList<TrendingTopic>();
		try {
			Trends trends = twitter.getPlaceTrends(loc.getWoeid());
			Date asof = trends.getAsOf(); 
			int rank = 1;
			for (Trend trend : trends.getTrends()) {
				TrendingTopic tt = new TrendingTopic(trend.getName(), "Twitter", rank++);
				tt.setTimestamp(asof);
				try {
					tt.setLink(new URL(trend.getURL()));
				} catch (MalformedURLException e) {
					e.printStackTrace();
				}
				tt.setLocation(loc.getName());
				out.add(tt);
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return out;
	}

	public List<TrendingTopic> getTrendingTopics() {
		List<TrendingTopic> out = new ArrayList<TrendingTopic>();
		for (Location loc : locationLoader.getAvailableLocations(twitter)) {
			out.addAll(getTrendsByLocation(loc));
		}
		return out;
	}
	
	
}
