package xld.node;

import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.eventbus.Message;




public abstract class ApiHandler implements Handler<Message<JsonObject>> {

	private ApiHandler parent = null;
	private ApiHandler topMost = null;
	private Message<JsonObject> message;
	private JsonObject response;
	
	private int counter = 0;
	
	
	public ApiHandler() {
		this.topMost = this;
	}
	
	public ApiHandler(ApiHandler parent) {
		this.parent = parent;
		this.topMost = parent.getTopMost();
	}
	
	public ApiHandler getTopMost() {
		if (parent != null) {
			return parent.getTopMost();
		} else {
			return this;
		}
	}
	
	public abstract void handle();
	
	// only topmost comes here, as (before) handle API request
	public void handle(Message<JsonObject> message) {
		this.message = message;
		response = new JsonObject();
		body("");
		status(200);
		contentType("text/plain");		
		
		handle();
	}
	
	// handling topmost requests and replys
	public Message<JsonObject> getMessage() {
		return topMost.message;
	}
	
	public String getParam(String paramName) {
		JsonObject params = getMessage().body().getObject("params");
		if (params == null)
			return null;
		else
			return params.getString("id");	
	}
	
	public void body(String body) {
		topMost.response.putString("body", body);
	}
	
	public void status(int status) {
		topMost.response.putNumber("status", status);
	}
	
	public void contentType(String contentType) {
		topMost.response.putString("contentType", contentType);
	}
	
	public void reply() {
		topMost.message.reply(topMost.response);
	}
	
	public void replyError(String msg) {
		body(msg);
		contentType("text/plain");
		status(400);
		reply();	
	}
	

	// Counter functions
	
	public void setCounter(int c) {
		this.counter = c;
	}
	public void oneReady() {
		this.counter--;
	}
	public boolean isReady() {
		return this.counter <= 0;
	}
		
}