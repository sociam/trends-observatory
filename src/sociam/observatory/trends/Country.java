package sociam.observatory.trends;

import sociam.observatory.trends.Location;

public class Country extends Location {

	private String name;
	private String code;
	
	public Country(String n, String c) {
		name = n;
		code = c;
	}
	
	@Override
	public String getName() {
		return name;
	}

	public String getCode() {
		return code;
	}
}
