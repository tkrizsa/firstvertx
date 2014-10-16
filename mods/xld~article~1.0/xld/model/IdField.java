package xld.model;

import org.vertx.java.core.json.JsonObject;

public class IdField extends Field {
	
	
	public IdField(Model model, String fieldName) {
		super(model, fieldName);
	}
	
	public boolean isPrimaryKey() {
		return true;
	}

	public void jsonGet(Model.Row row, JsonObject jrow) {
		try {
			long val = (long)row.get(fieldName);
			jrow.putNumber(fieldName, val);
		} catch(Exception ex) {
			//jrow.putNumber(
		}
	}
	
	public void jsonLoad(Model.Row row, JsonObject jrow) {
		/*try {
			long val = jrow.getLong(fieldName);
			row.set(fieldName, val);
		} catch (Exception ex) {
			row.set(fieldName, null);
		}*/
	}
	

}
