package sociam.observatory.trends;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.google.GoogleTrends;
import sociam.observatory.trends.storage.MongoWriter;
import sociam.observatory.trends.twitter.TwitterTrends;
import sociam.observatory.trends.yahoo.YahooTrends;

public class Observatory {

	public static void main(String[] args) {
		
		TwitterTrends tw = new TwitterTrends();
		GoogleTrends goo = new GoogleTrends();
		YahooTrends yah = new YahooTrends();
		
		MongoWriter writer = new MongoWriter("mdb-001.ecs.soton.ac.uk", "trends", "trends", "trends");

		while (true) {
			List<TrendingTopics> trending = new ArrayList<TrendingTopics>();
			trending.addAll(tw.getTrendingTopics());
			trending.addAll(goo.getTrendingTopics());
			trending.addAll(yah.getTrendingTopics());
			
			try { 
				writer.connect();
				for (TrendingTopics topics : trending) {
					if (!writer.write(topics)) {
						System.out.println("Not written! "+topics);
					}
//					System.out.println(MongoUtils.trendingTopicsToDBObject(topics).toString());
				}
				writer.disconnect();
				System.out.println(new Date());
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
