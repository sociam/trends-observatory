package sociam.observatory.trends;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import sociam.observatory.trends.twitter.TwitterTrends;
import twitter4j.JSONArray;
import twitter4j.JSONException;

public class Observatory {

	public static void main(String[] args) {
		TwitterTrends tw = new TwitterTrends();
		SimpleDateFormat filePattern = new SimpleDateFormat("yyyy-MM-dd_HH:mm");
		while (true) {
			List<TrendingTopic> trending = tw.getTrendingTopics();
			try {
				BufferedWriter writer;
				writer = new BufferedWriter(new FileWriter("trends/twitter/"+filePattern.format(new Date())));
				writer.write((new JSONArray(trending)).toString(2));
				writer.newLine();
				writer.flush();
				writer.close();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (JSONException e) {
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
