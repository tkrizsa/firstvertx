package xld.model;


public class IdField extends Field {
	
	
	public IdField(String fieldName) {
		super(fieldName);
	}
	
	public boolean isPrimaryKey() {
		return true;
	}
	

}
