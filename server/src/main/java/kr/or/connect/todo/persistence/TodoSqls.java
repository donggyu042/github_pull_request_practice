package kr.or.connect.todo.persistence;

public class TodoSqls {
	static final String DELETE_BY_ID ="DELETE FROM todo WHERE id = :id";
	static final String DELETE_COMPLETED_ALL = "DELETE FROM todo WHERE completed = 1";
	static final String SELECT_ALL = "SELECT id, todo, completed, TO_CHAR(date, 'YYYY-MM-DD PM HH24:MI:SS') date FROM todo ORDER BY date DESC";
	static final String SELECT_BY_ID = "SELECT id, todo, completed, TO_CHAR(date, 'YYYY-MM-DD PM HH24:MI:SS') date FROM todo WHERE id = :id";
	static final String UPDATE_TODO_BY_ID = "UPDATE todo SET todo = :todo WHERE id = :id";
	static final String UPDATE_COMPLETED_BY_ID = "UPDATE todo SET completed = :completed WHERE id = :id";
}
