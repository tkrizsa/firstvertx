package xld.model;

import org.vertx.java.core.json.JsonObject;



public abstract class Field {

	protected String fieldName;
	protected Model model;
	
	public Field(Model model, String fieldName) {
		this.model = model;
		this.fieldName = fieldName;
	}
	
	public String getFieldName() {
		return fieldName;
	}
	
	public boolean isPrimaryKey() {
		return false;
	}
	
	public boolean isAutoIncrement() {
		return false;
	}
	
	// important in key fields, to check if row exists
	public boolean isExistingRow(Model.Row row) {
		return false;
	}

	public abstract void jsonGet(Model.Row row, JsonObject jrow);
	public abstract void jsonLoad(Model.Row row, JsonObject jrow);
	public abstract String sqlValue(Model.Row row);
	public abstract String sqlValueByString(String sval);
	
}

