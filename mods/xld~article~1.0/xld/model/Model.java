package xld.model;


import xld.model.Field;
import xld.node.Node;
import xld.node.ApiHandler;
import xld.node.ApiHandlerSql;
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
	public String keySqlWhereByString(String keys) {
		String where = " (";
		String[] keysa = keys.split(KEY_SEPARATOR);
		int i = 0;
		for(Field field : fields) {
			if (!field.isPrimaryKey())
				continue;
			if (i>0)
				where += " AND ";
			where += "`" + field.getFieldName() + "` = " + field.sqlValueByString(keysa[i]) ;
			i++;
		}
		return where + ") ";
	}
	
	public String keySqlWhereByRows() {
		StringBuilder where = new StringBuilder();
		where.append("(");
		int i = 0;
		for (Row row : rows) {
			if (i>0)
				where.append(" OR ");
			where.append("(");
			int j = 0;
			for(Field field : fields) {
				if (!field.isPrimaryKey())
					continue;
				if (j>0)
					where.append(" AND ");
				where.append("`" + field.getFieldName() + "` = " + field.sqlValue(row));
				j++;
			}
			where.append(")");
			i++;
		}
		where.append(")");
		return where.toString();
	}
	
	
	public void sqlLoadList(final ApiHandler apiHandler) {
		sqlLoad("SELECT * FROM `" + getTableName() + "`", apiHandler);
	}
	
	public void sqlLoadByKeys(String keys, final ApiHandler apiHandler) {
		sqlLoad("SELECT * FROM `" + getTableName() + "` WHERE " + keySqlWhereByString(keys), apiHandler);
	}
	
	public void sqlReload(final ApiHandler apiHandler) {
		sqlLoad("SELECT * FROM `" + getTableName() + "` WHERE " + keySqlWhereByRows(), apiHandler);
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
	
	
	public void sqlSave(final ApiHandler extApiHandler) {
	
	
		final Model thisModel = this;
	
		List<String> queries = new ArrayList<String>();
		for (Row row : rows) {
			if (row.existing()) {
				String query = "";
				String where = " (";
				query += "UPDATE `" + this.getTableName() + "`" + "\r\n";
				boolean firstSet = true;
				boolean firstWhere = true;
				for (Field f : fields) {
					if (f.isPrimaryKey()) {
						if (!firstWhere)
							where += " AND ";
						where += " (`" + f.getFieldName() + "` = " + f.sqlValue(row) + ") ";
						firstWhere = false;
					} else {
						if (!firstSet)
							query += ", ";
						query += " SET `" + f.getFieldName() + "` = " + f.sqlValue(row) + "\r\n";
						
						firstSet = false;
					}
				}
				where += ") ";
				query += "WHERE " + where + "\r\n";
				queries.add(query);
			} else {
			
				StringBuilder query  = new StringBuilder();
				StringBuilder values  = new StringBuilder();
				query.append("INSERT INTO `" + getTableName() + "` (\r\n");
				int i = 0;
				for (Field f : fields) {
					if (f.isAutoIncrement()) {
						continue;
					}
					if (i>0) {
						query.append(", ");
						values.append(", ");
					}
					query.append("`").append(f.getFieldName()).append("`");
					values.append(f.sqlValue(row));
					i++;
				}
				query.append("\r\n) VALUES (\r\n").append(values.toString()).append("\r\n)\r\n");
				queries.add(query.toString());
		
			}
		}
		
		node.info("queries to save : " + queries.size());
		
		if (queries.size()==0) {
			extApiHandler.replyError("nothing to save");
			return;
		}
		
		sqlRun(queries, new ApiHandler(extApiHandler) {
			public void handle() {
				node.info("---> savedddd");
				sqlReload(extApiHandler);
			}
		});
	
	
		//apiHandler.handle();
	}
	
	public void sqlRun(final List<String> queries, final ApiHandler extApiHandler) {
		
		
		
		extApiHandler.setCounter(queries.size());
		final StringBuilder errors = new StringBuilder();
		for (String query : queries) {
			JsonObject q = new JsonObject();
			q.putString("action", "raw");
			q.putString("command", query);		
			node.eb().send("xld-sql-persist", q, new ApiHandlerSql(extApiHandler) {
				public void handle() {
					if (!sqlOk()) {
						errors.append(sqlError()).append("/r/n");
					} else {
					
					
					}
					extApiHandler.oneReady();
					if (extApiHandler.isReady()) {
						if (errors.length() == 0) {
							replyError(errors.toString());
						} else {
							extApiHandler.handle();
						
						}
					}
				

					
				}
			});
		}
	
	
	
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
		
		public boolean existing() {
			for (Field f : model.fields) {
				if (f.isPrimaryKey()) {
					if (f.isExistingRow(this))
						return true;
					else 
						return false;
				}
			
			}
			return false;
		}
	}
	
	
	/* ===================================================== ITERATOR ====================================================== */
	


	@Override
	public Iterator<Row> iterator() {
		return rows.iterator();
	}




	


}