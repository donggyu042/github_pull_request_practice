package kr.or.connect.todo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {

	private final TodoDao dao;
	
	@Autowired
	public TodoService(TodoDao dao){
		this.dao = dao;
	}
	
	public List<Todo> getAllTodos(){
		return dao.selectAll();
	}
	
	public int updateCompleted(Todo todo){
		return dao.updateCompleted(todo);
	}
	
	public int updateTodo(Todo todo){
		return dao.updateTodo(todo);
	}
	
	public Integer insertTodo(Todo todo){
		return dao.insert(todo);
	}
	
	public Todo selectById(Integer id){
		return dao.selectById(id);
	}
	
	public int deleteById(Integer id){
		return dao.deleteById(id);
	}
	
	public int deleteCompletedAll(){
		return dao.deleteCompletedAll();
	}
}
