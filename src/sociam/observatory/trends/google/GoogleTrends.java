package sociam.observatory.trends.google;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import sociam.observatory.trends.TrendingTopic;
import sociam.observatory.trends.TrendingTopics;

public class GoogleTrends {
	
	private String baseUrl;  //	"http://trends.google.com/trends/hottrends/widget?pn="+country+"&tn="+count;
	private String widgetUrl;
	
	public GoogleTrends() {
		baseUrl = "http://trends.google.com"; 
		widgetUrl = baseUrl+"/trends/hottrends/widget?"; // pn="+country+"&tn="+count;
	}
	
	private TrendingTopics extractTopics(Country country, int count) {
		
		TrendingTopics topics = null;
		try {
			Document doc = Jsoup.connect(widgetUrl+"pn=p"+country.code+"&tn="+count).get();
			topics = new TrendingTopics("Google", new Date(), country.name);
			Elements divs = doc.getElementsByClass("widget-single-item-detailed");
			int rank = 1;
			for (Element div : divs) {
//				Element innerDiv = div.getElementsByClass("widget-single-item-detailed-container").first();
				Element titleLink = div.getElementsByClass("widget-single-item-detailed-title-container").first().getElementsByTag("a").first(); 
				String title = titleLink.text();
				String link = baseUrl+titleLink.attr("href");
				TrendingTopic topic = new TrendingTopic(topics, title, rank++);
				topic.setLink(link);
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
			out.add(extractTopics(country, 10));
		}
		return out;
	}

//	public static void main(String[] args) {
//		GoogleTrends goog = new GoogleTrends();
//		System.out.println(goog.extractTopics(Country.GB, 10).getTopicCollection());
//	}

}
