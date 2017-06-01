var htmlTodoContent = '<li class="%completed%"><div class="view"><input class="toggle" type="checkbox" %checked%><label>%todo%</label><button class="destroy"></button><span class="date">%date%</span><span id="show-detail">[상세보기]</span><span class="id-container">%id%</span></div><input class="edit"></li>';

// 새로운 task 대한 html 문자열 반환
function makeNewTodo(todo){
    var newTodo = htmlTodoContent;
    newTodo = newTodo.replace('%completed%', (todo.completed === 0) ? '' : 'completed');
    newTodo = newTodo.replace('%checked%', (todo.completed === 0) ? '' : 'checked');
    newTodo = newTodo.replace('%todo%', todo.todo);
    newTodo = newTodo.replace('%date%', todo.date);
    newTodo = newTodo.replace('%id%', todo.id);
    return newTodo;
}

// task에 대한 완료 <-> 비완료 처리 담당 함수
function updateCompleted(mode, obj){
    var id = $(obj).siblings('.id-container').text();
    $.ajax({
        url: '/api/todos/' + id,
        method: 'PUT',
        data: {
            'completed': (mode === 'setCompleted') ? 1 : 0
        },
        success: function(data, textStatus, xhr){
            if(xhr.status === 204){
                $(obj).parents('li').toggleClass('completed');
                $leftTodoCount.text((mode === 'setCompleted') ?
                    parseInt($leftTodoCount.text())-1 : parseInt($leftTodoCount.text())+1);

                // 수정 상태에서 task를 완료하면 edit input을 다시 숨김
                if(mode === 'setCompleted'){
                    if($(obj).parent().siblings('.edit').css('display') !== 'none')
                        $(obj).parent().siblings('.edit').toggle();
                }
            }
        }
    }).fail(function(data){
        obj.checked = (mode === 'setCompleted') ? false : true;
        alert(((mode === 'setCompleted') ? '완료처리에 실패하였습니다.' : '완료 취소 처리에 실패 하였습니다.')
            + '잠시후 다시 시도해 주세요');
    }).done(function(){
        todoFilter($selectedFilter);
    });
}

function todoFilter(obj){
    switch(obj.text()){
        case 'All':
        $todoList.children('li').each(function(idx, todo){
            $(todo).show();
        });
        break;
        case 'Active':
        $todoList.children('li').each(function(idx, todo){
            if($(todo).attr('class') === 'completed') $(todo).hide();
            else{
                $(todo).show();
            }
        });
        break;
        case 'Completed':
        $todoList.children('li').each(function(idx, todo){
            if($(todo).attr('class') === 'completed') $(todo).show();
            else{
                $(todo).hide();
            }
        });
        break;
    }
}