package sociam.observatory.trends.yahoo;

import java.io.IOException;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import sociam.observatory.trends.Country;
import sociam.observatory.trends.TrendingTopic;
import sociam.observatory.trends.TrendingTopics;

public class YahooTrends {
	
	private String baseUrl;  //	"http://country.google.com
	
	public YahooTrends() {
		baseUrl = "yahoo.com"; 
	}
	
	private TrendingTopics extractTopics(Country country) {
		
		TrendingTopics topics = null;
		try {
			Document doc = Jsoup.connect("http://"+country.yahooId+"."+baseUrl).get();
			topics = new TrendingTopics("Yahoo", new Date(), country.name);
			Elements elems = doc.getElementsByClass("trendingnow_trend-list");
			for (Element el: elems) {
				if (el.tag().getName().equalsIgnoreCase("ol")) { 
					Elements lis = el.getElementsByTag("li");
					int rank = 1;
					for (Element li : lis) {
						Element a = li.getElementsByTag("a").first();
						String title = a.text();
						String link = a.attr("href");
						TrendingTopic topic = new TrendingTopic(topics, title, rank++);
						topic.setLink(link);
					}
					break;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return topics;
	}
	
	public List<TrendingTopics> getTrendingTopics() {
		//TODO replace this to be read from config file
		Country[] countries = {Country.US, Country.GB};
		
		List<TrendingTopics> out = new ArrayList<TrendingTopics>();
		for (Country country : countries) {
			TrendingTopics tts = extractTopics(country);
			if (tts != null) {
				out.add(tts);
			}
		}
		return out;
	}

//	public static void main(String[] args) {
//		YahooTrends yah = new YahooTrends();
//		System.out.println(yah.extractTopics(Country.US).getTopicCollection());
//		System.out.println(yah.extractTopics(Country.GB).getTopicCollection());
//	}

}
