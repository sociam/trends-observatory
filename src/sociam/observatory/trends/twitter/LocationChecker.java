package sociam.observatory.trends.twitter;

import java.util.ArrayList;
import java.util.List;

import sociam.observatory.trends.Country;
import twitter4j.Location;
import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterException;

public class LocationChecker {

	private boolean worldwide;
	private List<String> countries;
	private List<String> towns; // ["town name, country code"]

	public LocationChecker(boolean world, Country[] cs, String[] ts) {
		worldwide = world;
		countries = new ArrayList<String>();
		for (Country c : cs) {
			countries.add(c.isoCode);
		}
		towns = new ArrayList<String>();
		for (String t : ts) {
			towns.add(t);
		}
	}

	public LocationChecker(boolean world, List<Country> cs) {
		worldwide = world;
		countries = new ArrayList<String>();
		for (Country c : cs) {
			countries.add(c.isoCode);
		}
		towns = new ArrayList<String>();
	}

	public List<Location> getAvailableLocations(Twitter twitter) {
		List<Location> locations = new ArrayList<Location>();
		if (worldwide) {
			locations.add(Worldwide.getInstance());
		}
		try {
			ResponseList<Location> available = twitter.getAvailableTrends();
			for (Location loc : available) {
				if (loc.getPlaceName().equals("Country")) {
					if (countries.contains(loc.getCountryCode())) {
						locations.add(loc);
					}
				} else {
					if (towns.contains(loc.getName() + ", "
							+ loc.getCountryCode())) {
						locations.add(loc);
					}
				}
			}
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		return locations;
	}

	public static class Worldwide implements Location {

		private static Worldwide instance;

		protected Worldwide() {
		}

		public static Worldwide getInstance() {
			if (instance == null) {
				instance = new Worldwide();
			}
			return instance;
		}

		@Override
		public int getWoeid() {
			return 1;
		}

		@Override
		public String getCountryName() {
			return "Worldwide";
		}

		@Override
		public String getCountryCode() {
			return "";
		}

		@Override
		public String getPlaceName() {
			return "World";
		}

		@Override
		public int getPlaceCode() {
			return 1;
		}

		@Override
		public String getName() {
			return "Worldwide";
		}

		@Override
		public String getURL() {
			return "";
		}
	}

}
