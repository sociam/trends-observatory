package sociam.observatory.trends;

public abstract class Location {
	
	public static final Location Worldwide = new Location() {
		@Override
		public String getName() {
			return "Worldwide";
		}
	};
	
	public abstract String getName();

}
