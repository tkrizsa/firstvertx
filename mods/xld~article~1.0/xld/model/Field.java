package xld.model;


public class Field {

	private String fieldName;
	
	public Field(String fieldName) {
		this.fieldName = fieldName;
	}
	
	public String getFieldName() {
		return fieldName;
	}
	
	public boolean isPrimaryKey() {
		return false;
	}

}

