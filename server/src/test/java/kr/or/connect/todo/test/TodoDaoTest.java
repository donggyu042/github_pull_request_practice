package kr.or.connect.todo.test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.persistence.TodoDao;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TodoDaoTest {
	
	@Autowired
	private TodoDao dao;
	
	private final Logger log = LoggerFactory.getLogger(TodoDao.class);
	
	@Test
	public void shouldSelectAll(){
		List<Todo> allTodos = dao.selectAll();
		assertThat(allTodos, is(notNullValue()));
	}
	
	@Test
	public void shouldSelectById(){
		Todo todo = dao.selectById(1);
		assertThat(todo, is(notNullValue()));
	}
	
	@Test
	public void shouldInsert(){
		Todo todo = new Todo();
		todo.setTodo("coding");
		Integer id = dao.insert(todo);
		Todo result = dao.selectById(id);
		assertThat(result.getTodo(), is("coding"));
	}
	
	@Test
	public void shouldDelete(){
		Todo todo = new Todo();
		todo.setTodo("coding");
		Integer id = dao.insert(todo);
		int result = dao.deleteById(id);
		assertThat(result, is(1));
	}
	
	@Test
	public void shouldUpdate(){
		Todo todo = new Todo();
		todo.setTodo("coding");
		Integer id = dao.insert(todo);
		
		todo = dao.selectById(id);
		
		todo.setCompleted(1);
		int result = dao.updateTodo(todo);
		
		assertThat(result, is(1));
		todo = dao.selectById(id);
		log.info(todo.toString());
	}
	
}
