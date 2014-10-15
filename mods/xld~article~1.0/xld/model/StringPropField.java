package xld.model;


public class StringPropField extends Field {
	
	private int maxLength;
	
	public StringPropField(String fieldName, int maxLength) {
		super(fieldName);
		this.maxLength = maxLength;
	}

}