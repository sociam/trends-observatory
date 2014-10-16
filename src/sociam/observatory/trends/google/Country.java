package sociam.observatory.trends.google;

public class Country {
	
	public String name;
	public int code;

	protected Country(String n, int c) {
		name = n;
		code = c;
	}	

	public static final Country US = new Country("United States", 1);
	public static final Country GB = new Country("United Kingdom", 9);

}

