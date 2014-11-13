package sociam.observatory.trends.twitter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.Country;
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
	
	public TwitterTrends() {
		twitter = new TwitterFactory().getInstance();
	}

	private TrendingTopics getTrendsByLocation(Location loc) {
		TrendingTopics topics = null;
		try {
			if (twitter.getRateLimitStatus().get("/trends/place").getRemaining() > 0) {
				Trends trends = twitter.getPlaceTrends(loc.getWoeid());
				Date asof = trends.getAsOf();
				topics = new TrendingTopics("Twitter", asof, (loc.getPlaceName().equals("Town")?loc.getName()+", "+loc.getCountryName():loc.getName()));
				int rank = 1;
				for (Trend trend : trends.getTrends()) {
					TrendingTopic tt = new TrendingTopic(topics, trend.getName(), rank++);
					tt.setLink(trend.getURL());
				}
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return topics;
	}

	public List<TrendingTopics> getTrendingTopics() {
		Country[] cs = {Country.US, Country.GB};
		String[] ts = {"London, GB", "Washington, US"};
		LocationChecker checker = new LocationChecker(true, cs, ts);
		
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		for (Location loc : checker.getAvailableLocations(twitter)) {
			TrendingTopics tts = getTrendsByLocation(loc); 
			if (tts != null) {
				out.add(tts);
			}
		}
		return out;
	}
	
	
}
