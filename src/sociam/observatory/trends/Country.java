package sociam.observatory.trends;

public class Country {
	
	public String name;
	public String isoCode;
	public String googleId;
	public String yahooId; 

	protected Country(String n, String iso, String goog, String y) {
		name = n;
		isoCode = iso;
		googleId = goog;
		yahooId = y;
	}	

	public static final Country AR = new Country("Argentina", "AR", "30", "ar");
	public static final Country AU = new Country("Australia", "AU", "8", "au");
	public static final Country AT = new Country("Austria", "AT", "44", "");
	public static final Country BE = new Country("Belgium", "BE", "41", "be");
	public static final Country BR = new Country("Brazil", "BR", "18", "br");
	public static final Country CA = new Country("Canada", "CA", "13", "ca");
	public static final Country CL = new Country("Chile", "CL", "38", "cl");
	public static final Country CO = new Country("Colombia", "CO", "32", "co");
	public static final Country CZ = new Country("Czech Republic", "CZ", "43", "");
	public static final Country DK = new Country("Denmark", "DK", "49", "");
	public static final Country EG = new Country("Egypt", "EG", "29", "");
	public static final Country FI = new Country("Finland", "FI", "50", "");
	public static final Country FR = new Country("France", "FR", "16", "fr");
	public static final Country DE = new Country("Germany", "DE", "15", "de");
	public static final Country GR = new Country("Greece", "GR", "48", "gr");
	public static final Country HK = new Country("Hong Kong", "HK", "10", "hk");
	public static final Country HU = new Country("Hungary", "HU", "45", "");
	public static final Country IN = new Country("India", "IN", "3", "in");
	public static final Country ID = new Country("Indonesia", "ID", "19", "id");
	public static final Country IE = new Country("Ireland", "IE", "", "ie");	
	public static final Country IL = new Country("Israel", "IL", "6", "");
	public static final Country IT = new Country("Italy", "IT", "27", "it");
	public static final Country JP = new Country("Japan", "JP", "4", "");
	public static final Country KE = new Country("Kenya", "KE", "37", "");
	public static final Country MY = new Country("Malaysia", "MY", "34", "malaysia");
	public static final Country MX = new Country("Mexico", "MX", "21", "mx");
	public static final Country NL = new Country("Netherlands", "NL", "17", "");
	public static final Country NZ = new Country("New Zealand", "NZ", "", "nz");
	public static final Country NG = new Country("Nigeria", "NG", "52", "");
	public static final Country NO = new Country("Norway", "NO", "51", "");
	public static final Country PE = new Country("Peru", "PE", "", "pe");
	public static final Country PH = new Country("Philippines", "PH", "25", "ph");
	public static final Country PL = new Country("Poland", "PL", "31", "");
	public static final Country PT = new Country("Portugal", "PT", "47", "");
	public static final Country RO = new Country("Romania", "RO", "39", "");
	public static final Country RU = new Country("Russia", "RU", "14", "");
	public static final Country SA = new Country("Saudi Arabia", "SA", "36", "");
	public static final Country SG = new Country("Singapore", "SG", "5", "sg");
	public static final Country ZA = new Country("South Africa", "ZA", "40", "za");
	public static final Country KR = new Country("South Korea", "KR", "23", "");
	public static final Country ES = new Country("Spain", "ES", "26", "es");
	public static final Country SE = new Country("Sweden", "SE", "42", "se");
	public static final Country CH = new Country("Switzerland", "CH", "46", "");
	public static final Country TW = new Country("Taiwan", "TW", "12", "tw");
	public static final Country TH = new Country("Thailand", "TH", "33", "");
	public static final Country TR = new Country("Turkey", "TR", "24", "");
	public static final Country UA = new Country("Ukraine", "UA", "35", "");
	public static final Country GB = new Country("United Kingdom", "GB", "9", "uk");
	public static final Country US = new Country("United States", "US", "1", "us");
	public static final Country VN = new Country("Vietnam", "VN", "28", "vn");
	public static final Country VE = new Country("Venezuela", "VE", "", "ve");

}

