package xld.model;

import org.vertx.java.core.json.JsonObject;

public class IdField extends Field {
	
	
	public IdField(Model model, String fieldName) {
		super(model, fieldName);
	}
	
	public boolean isPrimaryKey() {
		return true;
	}
	
	public boolean isAutoIncrement() {
		return true;
	}
	
	public boolean isExistingRow(Model.Row row) {
		return row.get(fieldName) != null;
	}
	

	public void jsonGet(Model.Row row, JsonObject jrow) {
		Object val = row.get(fieldName);
		if (val != null)
			jrow.putNumber(fieldName, (long)val);
	}
	
	public void jsonLoad(Model.Row row, JsonObject jrow) {
		try {
			long val = jrow.getLong(fieldName);
			row.set(fieldName, val);
		} catch (Exception ex) {
			row.set(fieldName, null);
			//throw new RuntimeException("Cannot read field " + fieldName);
		}
	}
	
	public String sqlValue(Model.Row row) {
		Object val = row.get(fieldName);
		if (val == null)
			return "NULL";
		else 
			return Long.toString((long)val);
	}
	
	public String sqlValueByString(String sval) {
		long val = Long.parseLong(sval, 10);
		return Long.toString(val);
	}
	

}
