package sociam.observatory.trends;

import sociam.observatory.trends.twitter.TwitterTrends;

public class Observatory {

	public static void main(String[] args) {
		TwitterTrends tw = new TwitterTrends();
		tw.getOnce();
	}

}
