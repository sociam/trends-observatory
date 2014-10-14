package sociam.observatory.trends.twitter;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.TrendingTopic;
import sociam.observatory.trends.TrendingTopics;
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

	private TrendingTopics getTrendsByLocation(Location loc) {
		TrendingTopics topics = null;
		try {
			Trends trends = twitter.getPlaceTrends(loc.getWoeid());
			Date asof = trends.getAsOf();
			topics = new TrendingTopics("Twitter", asof, (loc.getPlaceName().equals("Town")?loc.getName()+", "+loc.getCountryName():loc.getName()));
			int rank = 1;
			for (Trend trend : trends.getTrends()) {
				TrendingTopic tt = new TrendingTopic(topics, trend.getName(), rank++);
				try {
					tt.setLink(new URL(trend.getURL()));
				} catch (MalformedURLException e) {
					e.printStackTrace();
				}
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return topics;
	}

	public List<TrendingTopics> getTrendingTopics() {
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		for (Location loc : locationLoader.getAvailableLocations(twitter)) {
			out.add(getTrendsByLocation(loc));
		}
		return out;
	}
	
	
}
