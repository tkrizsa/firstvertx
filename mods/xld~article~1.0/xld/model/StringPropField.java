package xld.model;

import org.vertx.java.core.json.JsonObject;

public class StringPropField extends Field {
	
	private int maxLength;
	
	public StringPropField(Model model, String fieldName, int maxLength) {
		super(model, fieldName);
		this.maxLength = maxLength;
	}
	
	public void jsonGet(Model.Row row, JsonObject jrow) {
		String val = (String)row.get(fieldName);
		jrow.putString(fieldName, val);
	}
	
	public void jsonLoad(Model.Row row, JsonObject jrow) {
		String val = jrow.getString(fieldName);
		row.set(fieldName, val);
	}	

}