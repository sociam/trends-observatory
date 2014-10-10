package sociam.observatory.trends.twitter;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.Country;
import sociam.observatory.trends.TrendingTopic;
import twitter4j.Location;
import twitter4j.ResponseList;
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

	private List<Location> getAvailableCountries() {
		List<Location> countries = new ArrayList<Location>();
		try {
			ResponseList<Location> locations = twitter.getAvailableTrends();
			for (Location loc : locations) {
				if (loc.getPlaceName().equals("Country")) {
					countries.add(loc);
				}
			}
		} catch (TwitterException te) {
			te.printStackTrace();
		}
		return countries;
	}
	
	private List<TrendingTopic> getTrendsByCountry(Location country) {
		List<TrendingTopic> out = new ArrayList<TrendingTopic>();
		try {
			Trends trends = twitter.getPlaceTrends(country.getWoeid());
			Date asof = trends.getAsOf(); 
			Country c = new Country(country.getCountryName(), country.getCountryCode()); // check if country == trends.getLocation()
			int rank = 1;
			for (Trend trend : trends.getTrends()) {
				TrendingTopic tt = new TrendingTopic(trend.getName(), "Twitter", rank++);
				tt.setTimestamp(asof);
				try {
					tt.setLink(new URL(trend.getURL()));
				} catch (MalformedURLException e) {
					e.printStackTrace();
				}
				tt.setLocation(c);
				out.add(tt);
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return out;
	}

	private List<TrendingTopic> getTrendsWorldwide() {
		List<TrendingTopic> out = new ArrayList<TrendingTopic>();
		try {
			Trends trends = twitter.getPlaceTrends(1);
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
				tt.setLocation(sociam.observatory.trends.Location.Worldwide);
				out.add(tt);
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return out;
	}
	
	public void getOnce() {
		for (TrendingTopic tt : getTrendsWorldwide()) {
			System.out.println(tt);
		}
		for (Location country : getAvailableCountries() ) {
			for (TrendingTopic tt : getTrendsByCountry(country)) {
				System.out.println(tt);
			}
			System.exit(0);
		}
	}
}
