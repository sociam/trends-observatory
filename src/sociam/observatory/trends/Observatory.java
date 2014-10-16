package sociam.observatory.trends;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import sociam.observatory.trends.google.GoogleTrends;
import sociam.observatory.trends.storage.MongoWriter;
import sociam.observatory.trends.twitter.TwitterTrends;

public class Observatory {

	public static void main(String[] args) {
		
		TwitterTrends tw = new TwitterTrends();
		GoogleTrends goog = new GoogleTrends();
		
		MongoWriter writer = new MongoWriter("mdb-001.ecs.soton.ac.uk", "trends", "trends", "trends");

		while (true) {
			List<TrendingTopics> trending = new ArrayList<TrendingTopics>();
			trending.addAll(tw.getTrendingTopics());
			trending.addAll(goog.getTrendingTopics());
			
			try { 
				writer.connect();
				for (TrendingTopics topics : trending) {
					if (!writer.write(topics)) {
						System.out.println("Not written! "+topics);
					}
//					System.out.println(MongoUtils.trendingTopicsToDBObject(topics).toString());
				}
				writer.disconnect();
			} catch(UnknownHostException e) {
				e.printStackTrace();
			}
			try {
				Thread.sleep(300000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

}
