package xld.model;

import org.vertx.java.core.json.JsonObject;
import org.owasp.esapi.codecs.MySQLCodec;
import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Encoder;

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
	
	public String sqlValue(Model.Row row) {
		Object val = row.get(fieldName);
		if (val == null)
			return "NULL";
		else  {
			MySQLCodec cod 		= new MySQLCodec(MySQLCodec.MYSQL_MODE);
			Encoder enc 		= ESAPI.encoder();
			return "'" + enc.encodeForSQL(cod, val.toString()) + "'";
		}
	}
	
	public String sqlValueByString(String sval) {
		if (sval == null)
			return "NULL";
		else  {
			MySQLCodec cod 		= new MySQLCodec(MySQLCodec.MYSQL_MODE);
			Encoder enc 		= ESAPI.encoder();
			return "'" + enc.encodeForSQL(cod, sval) + "'";
		}
	}
	

}