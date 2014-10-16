package xld.model;


import xld.model.Field;
import xld.node.Node;
import xld.node.ApiHandler;
import xld.model.IdField;
import xld.model.StringPropField;


import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;

import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import java.lang.Iterable;
import java.lang.IndexOutOfBoundsException;
import javax.naming.OperationNotSupportedException;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;



public class Model implements Iterable {


	public static String MODEL_ID = "???";

	protected Node node;
	protected List<Field> fields = new ArrayList<Field>();
	protected List<Row> rows = new ArrayList<Row>();
	protected String tableName;
	protected String KEY_SEPARATOR = ",";
	
	// constructor
	public Model(Node node) {
		this.node = node;
	}
	
	public Model createNew() {
		try {
			return this.getClass().getConstructor(Node.class).newInstance(new Object[] {node});
		} catch (Exception ex) {
			node.error("Exception create class : " + this.getClass().toString());
			node.error(ex.getMessage());
		}
		return null;
	}
	
	
	//tableName
	public String getTableName() {
		return tableName;
	}
	
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	//modelId
	private String modelId = null;
	
	public String getModelId() {
		if (modelId != null) {
			return modelId;
		}
		modelId = "xxx";
		try {
			Class<? extends Model> mt = this.getClass();
			java.lang.reflect.Field f = mt.getField("MODEL_ID");
			modelId = f.get(null).toString();
		} catch (Exception ex) {
			node.error("==== error ====");
			node.error(ex.getMessage());
		}
		return modelId;
	}
	
	public String getModelIdPlural() {
		return this.getModelId() + "s";
	}
	
	/*public static void setModelId(String modelId) {
		this.modelId = modelId;
	}*/
	
	
	// fields
	public Field fieldAdd(Field f) {
		fields.add(f);
		return f;
	}
	
	public IdField fieldAddId(String fieldName) {
		IdField f = new IdField(this, fieldName);
		fieldAdd(f);
		return f;
	}
	
	public StringPropField fieldAddStringProp(String fieldName, int maxLength) {
		StringPropField f = new StringPropField(this, fieldName, maxLength);
		fieldAdd(f);
		return f;
	}
	
	public int fieldIx(String fieldName) {
		int ix = -1;
		for (Field f : fields) {
			ix++;
			if (f.getFieldName().equals(fieldName))
				return ix;
		
		}
		return -1;
	}
	
	public int fieldCount() {
		return fields.size();
	
	}
	
	
	public void clear() {
		rows = new ArrayList<Row>();
	}
	
	public Row rowAdd() {
		Row r = new Row(this);
		
		
		rows.add(r);
		return r;
	}
	
	public boolean empty() {
		return rows.size() == 0;
	}
	
	/* ===================================================== JSON ====================================================== */
	
	public String jsonGet() {
		JsonObject jres = new JsonObject();
		JsonArray jrows = new JsonArray();
		jres.putArray("rows", jrows);
		for (Row row : rows) {
			JsonObject jrow = new JsonObject();
			for (Field field : fields) {
				field.jsonGet(row, jrow);
			}
			jsonAddLinks(row, jrow);
			jrows.addObject(jrow);
			//node.info(row.get("articleId") + " : " + row.get("articleName"));
		}
		return jres.toString();
	}
	
	protected void jsonAddLinks(Row row, JsonObject jrow) {
		String keys = keysToString(row);
		if ("".equals(keys))
			return;
	
		JsonObject jself = new JsonObject();
		jself.putString("href", "/api/" + getModelIdPlural() + "/" + keys);
		jrow.putObject("self", jself);
		
		JsonObject jgui = new JsonObject();
		jgui.putString("href", "/" + getModelIdPlural() + "/" + keys);
		jrow.putObject("gui", jgui);
	}
	
	protected String keysToString(Row row) {
		String keys = "";
		for(Field field : fields) {
			if (!field.isPrimaryKey())
				continue;
			Object val = row.get(field.getFieldName());
			if (val == null)
				continue;
			if (!"".equals(keys))
				keys += KEY_SEPARATOR;
			keys += val;
		}
		return keys;
	}
	
	
	public void jsonLoad(JsonObject jdata) {
		clear();
		JsonArray jrows = jdata.getArray("rows");
		for (int ix = 0; ix < jrows.size(); ix++) {
			JsonObject jrow = jrows.get(ix);
			node.info(jrow);
			Row row = rowAdd();
			for (Field f : fields) {
				f.jsonLoad(row, jrow);
			}
		}
	}
	
	/* ===================================================== SQL ====================================================== */
	public String keySqlWhere(String keys) {
		String where = " (";
		String[] keysa = keys.split(KEY_SEPARATOR);
		int i = 0;
		for(Field field : fields) {
			if (!field.isPrimaryKey())
				continue;
			if (i>0)
				where += " AND ";
			where += "`" + field.getFieldName() + "` = '" + keysa[i] + "'";
			i++;
		}
		return where + ") ";
	}
	
	
	
	public void sqlLoadList(final ApiHandler apiHandler) {
		sqlLoad("SELECT * FROM `" + getTableName() + "`", apiHandler);
	}
	
	public void sqlLoadByKeys(String keys, final ApiHandler apiHandler) {
		sqlLoad("SELECT * FROM `" + getTableName() + "` WHERE " + keySqlWhere(keys), apiHandler);
	}
	
	
	private void sqlJsonRead(JsonObject json) {
	
		JsonArray jfields = json.getArray("fields");
		
		int[] fmap = new int[fields.size()];
		for (int i = 0; i < fields.size(); i++) 
			fmap[i] = -1;
		
		Iterator<Object> jfieldsIt = jfields.iterator(); 
		{
			int i = 0;
			while (jfieldsIt.hasNext()) {
				String fn = (String)jfieldsIt.next();
				int ix = fieldIx(fn);
				if (ix < 0) {
					i++;
					continue;
				}
				fmap[ix] = i;
				i++;
			}
		}
		
		JsonArray jresults = json.getArray("results");
		Iterator<Object> jresultIt = jresults.iterator();
		while (jresultIt.hasNext()) {
			JsonArray jrow = (JsonArray)jresultIt.next();
			Row row = rowAdd();
			for ( int i = 0; i < fmap.length; i++) {
				if (fmap[i] < 0)
					continue;
				row.set(i, jrow.get(fmap[i]));
			}
		}
	}
	
	public void sqlLoad(String query,  final ApiHandler apiHandler) {
	
		clear();
				
		JsonObject q = new JsonObject();
		q.putString("action", "raw");
		q.putString("command", query);
		
		final Model thisModel = this;
		
		node.eb().send("xld-sql-persist", q, new Handler<Message<JsonObject>>() {
			public void handle(final Message<JsonObject> ar) {
				if (!("ok".equals(ar.body().getString("status")))) {
					apiHandler.replyError(ar.body().getString("message"));
					return;
				}
			
				sqlJsonRead(ar.body());
				
				apiHandler.handle();
				
				
			}
		});
	}
	
	/* ===================================================== Row ====================================================== */
	
	public static class Row {
		private final Model model;
		private Object[] data;
		
		public Row(Model model) {
			this.model = model;
			this.data = new Object[model.fieldCount()];
		}
	
		public Object get(String fieldName) {
			int ix = model.fieldIx(fieldName);
			if (ix<0)
				return null;
				//throw new IndexOutOfBoundsException();
			return data[ix];
		}

		public Object get(int ix) {
			if (ix<0 || ix >= model.fieldCount())
				return null;
				//throw new IndexOutOfBoundsException();
			return data[ix];
		}
		
		public void set(String fieldName, Object value) {
			int ix = model.fieldIx(fieldName);
			if (ix<0)
				return;
				//throw new IndexOutOfBoundsException();
			data[ix] = value;
		}

		public void set(int ix, Object value) {
			if (ix<0 || ix >= model.fieldCount())
				return;
				//throw new IndexOutOfBoundsException();
			data[ix] = value;
		}
	}
	
	
	/* ===================================================== ITERATOR ====================================================== */
	


	@Override
	public Iterator<Row> iterator() {
		return rows.iterator();
	}




	


}