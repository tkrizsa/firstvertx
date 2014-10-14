package xld.article;

import xld.model.Model;
import xld.node.Node;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.AsyncResult;


public class Article extends Model {

	Node node;

	public Article(Node node) {
		this.node = node;
	}
	
	
	public void doit() {
		JsonObject q = new JsonObject();
		q.putString("action", "raw");
		q.putString("command", "SELECT * FROM partner");
		
		node.eb().send("xld-sql-persist", q, new AsyncResultHandler<JsonObject>() {
			public void handle(AsyncResult<JsonObject> ar) {
				node.info(ar.result());
			
			}
		
		});
	
		node.info("i did it!");
	
	
	
	}

}