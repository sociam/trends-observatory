package sociam.observatory.trends.twitter;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import twitter4j.Location;
import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterException;

public class LocationLoader {

	private String locationsFile;
	private boolean worldwide;
	private List<String> countries;
	private List<String> towns;

	public LocationLoader(String path) {
		locationsFile = path;
		worldwide=true;
		countries = new ArrayList<String>();
		towns = new ArrayList<String>();
	}

	public LocationLoader() {
		this("locations.properties");
	}

	private void readConfig() {
		try {
			FileReader reader = new FileReader(locationsFile);
			Properties props = new Properties();
			props.load(reader);
			worldwide = new Boolean(props.getProperty("worldwide", "false")).booleanValue();
			if (props.containsKey("countries")) {
				countries = new ArrayList<String>();
				for (String code: props.getProperty("countries").split(",")) {				
					countries.add(code.trim());
				}
			}
			if (props.containsKey("towns")) {
				towns = new ArrayList<String>();
				for (String town: props.getProperty("towns").split(",")) {				
					towns.add(town.trim());
				}
			}			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public List<Location> getAvailableLocations(Twitter twitter) {
		List<Location> locations = new ArrayList<Location>();
		readConfig();
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
					if (towns.contains(loc.getName()+";"+loc.getCountryCode())) {
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
		protected Worldwide() {}

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
