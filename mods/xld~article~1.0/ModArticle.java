import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.platform.Verticle;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.JsonArray;

import xld.node.Node;
import xld.node.ApiHandler;


public class ModArticle extends Node {

	public void start() {
		startModule("article");
		

		
		registerApi("/java/proba", new ApiHandler () {
			public void handle() {
				body("Minden a legnagyobb rendben!");
				reply();	
			}
		});
		
		registerApi("/api/articles", new ApiHandler () {
			public void handle() {
				JsonObject art = new JsonObject();
				art.putString("articleName", "Elsõ cikkem");
				JsonArray rows = new JsonArray();
				rows.addObject(art);
				JsonObject res = new JsonObject();
				res.putArray("rows", rows);
				body(res.toString());
				contentType("application/json");
				reply();	
			}
		});
		


		registerTemplate("articles");

	
	}
}