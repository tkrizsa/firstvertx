package xld.node;

import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.eventbus.Message;


public abstract class ApiHandler implements Handler<Message<JsonObject>> {

	public Message<JsonObject> message;
	public JsonObject response = new JsonObject();
	
	public abstract void handle();
	
	public void handle(Message<JsonObject> message) {
		this.message = message;
		
		response = new JsonObject();
		body("");
		status(200);
		contentType("text/plain");		
		
		this.handle();
	}
	
	public void body(String body) {
		response.putString("body", body);
	}
	
	public void status(int status) {
		response.putNumber("status", status);
	}
	
	public void contentType(String contentType) {
		response.putString("contentType", contentType);
	}
	
	
	

	public void reply() {
		message.reply(response);
	}
	
	


}