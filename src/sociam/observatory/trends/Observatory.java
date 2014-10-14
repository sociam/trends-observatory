package sociam.observatory.trends;

import java.net.UnknownHostException;
import java.util.List;

import sociam.observatory.trends.storage.MongoWriter;
import sociam.observatory.trends.twitter.TwitterTrends;

public class Observatory {

	public static void main(String[] args) {
		TwitterTrends tw = new TwitterTrends();
//		SimpleDateFormat filePattern = new SimpleDateFormat("yyyy-MM-dd_HH:mm");
		MongoWriter writer = new MongoWriter("mdb-001.ecs.soton.ac.uk", "trends", "trends", "trends");
		while (true) {
			List<TrendingTopics> trending = tw.getTrendingTopics();
			try { 
				writer.connect();
				for (TrendingTopics topics : trending) {
					if (!writer.write(topics)) {
						System.out.println("Not written! "+topics);
					}
				}
				writer.disconnect();
			} catch(UnknownHostException e) {
				e.printStackTrace();
			}
//			try {
//				BufferedWriter writer;
//				writer = new BufferedWriter(new FileWriter("trends/twitter/"+filePattern.format(new Date())));
//				writer.write((new JSONArray(trending)).toString(2));
//				writer.newLine();
//				writer.flush();
//				writer.close();
//			} catch (IOException e) {
//				e.printStackTrace();
//			} catch (JSONException e) {
//				e.printStackTrace();
//			}
			try {
				Thread.sleep(300000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

}
