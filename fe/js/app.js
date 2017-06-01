(function (window) {
	'use strict';

})(window);

$(document).ready(function(){
    $todoInput = $('.new-todo');
    $todoList = $('.todo-list');
    $leftTodoCount = $('.todo-count').children('strong');
    $selectedFilter = $('ul.filters a.selected');
    $todoDetailContainer = $('.todo-detail-container');

    // 웹 페이지 처음 로드시 todo list를 가져와서 뿌려줌
    $.ajax({
        url: "/api/todos",
        method: "GET",
        dataType: "json",
        success: function(data){
            var leftTodoCount = 0;
            $.each(data, function(idx, todo){

                if(todo.completed === 0) leftTodoCount++;

                var newTodo = makeNewTodo(todo);
                $todoList.append(newTodo);
            });
            $leftTodoCount.text(leftTodoCount);
        }
    }).fail(function(){
        console.log('Todo리스트 목록을 가져올 수 없습니다.\n');
    });

    // 새로운 할일 추가
    $todoInput.keypress(function(e){
        if(e.keyCode === 13){
            if($todoInput.val().trim().length === 0){
                alert('할 일을 입력하세요.');
                $todoInput.val('');
                $todoInput.focus();
            }else{
                if(confirm($todoInput.val() + ' 을 todo리스트에 등록하시겠습니까?')){
                    $.ajax({
                        url: "/api/todos",
                        method: "POST",
                        data: {
                            'todo': $todoInput.val()
                        },
                        success: function(todo){
                            var newTodo = makeNewTodo(todo);
                            $todoList.prepend(newTodo);
                            $todoInput.val('');
                            $todoInput.focus();
                            $leftTodoCount.text(parseInt($leftTodoCount.text())+1);
                        }
                    }).fail(function(){
                        alert('등록에 실패 하였습니다. 다시 시도해 주세요.');
                    }).done(function(){
                        todoFilter($selectedFilter);
                    });
                }
            }
        }
    });

    // 삭제 기능
    $todoList.on('click', '.destroy', function(e){
        if(confirm($(this).siblings('label').text() + " 을 삭제하시겠습니까?")){
            var thiz = this;
            var id = $(this).siblings('.id-container').text();
            $.ajax({
                url: "/api/todos/" + id,
                method: "DELETE",
                success: function(result){
                    if($(thiz).siblings('input[type=checkbox]').is(':checked') == false){
                        $leftTodoCount.text(parseInt($leftTodoCount.text())-1);
                    }
                    $(thiz).parents('li').remove();
                }
            }).fail(function(){
                alert('목록 삭제에 실패하였습니다. 다시 시도해 주세요.');
            });
        }
    });

    // task에 대해서 완료 <-> 비완료 기능 처리
    $todoList.on('change', 'input[type=checkbox].toggle', function(){
        if(this.checked === true){
            if(confirm($(this).siblings('label').text() + " 할 일을 완료 하시겠습니까?")){
                updateCompleted('setCompleted', this);
            }else{
                this.checked = false;
            }
        }else{
             if(confirm($(this).siblings('label').text() + " 의 완료상태를 취소하시겠습니까?")){
                updateCompleted('setUncompleted', this);
            }else{
                this.checked = true;
            }
        }
    });


    // task 수정
    $todoList.on('dblclick', 'label', function(){
        if($(this).siblings('input[type=checkbox]').is(':checked')){
            alert('이미 완료한 Task는 수정할 수 없습니다.');
            return;
        }

        var todo = $(this).text();
        $(this).parent().siblings('.edit').val(todo).toggle().focus();
    });

    // task 수정
    $todoList.on('keypress', '.edit', function(e){
        var $obj = $(this);
        var id = $obj.siblings('.view').children('.id-container').text();
        if(e.keyCode === 13){
            if($obj.val().trim().length === 0){
                alert('변경 될 할일을 입력하십시오.');
                $obj.val('');
                $obj.focus();
            }else{
                if(confirm($obj.val() + '으로 할 일을 수정하시겠습니까?')){
                    $.ajax({
                        url: '/api/todos/' + id,
                        method: 'PUT',
                        data: {
                            'todo': $obj.val()
                        },
                        success: function(todo){
                            $obj.siblings('.view').children('label').text($obj.val());
                            $obj.toggle();
                        }
                    }).fail(function(){
                        alert('변경에 실패 하였습니다. 다시 시도해 주세요.');
                    });
                }
            }
        }
    });

    $('.filters').on('click', 'a', function(e){
        e.preventDefault();
        $selectedFilter.removeClass('selected');
        $(this).addClass('selected');
        $selectedFilter = $(this);
        todoFilter($selectedFilter);
    });

    // 개발 체크리스트 보기
    $('.check-list').click(function(){
        console.log('dd');
    });

    // 마우스 hover시 task들의 상세 정보 보여줌
    $todoList.on('mouseenter', '#show-detail', function(){
        var $obj = $(this);
        $('#todo-detail').css({
            'top': $obj.parents('li').offset().top + 60,
            'left': $obj.parents('li').offset().left + 70,
            'z-index': 10
        });
        $todoDetailContainer.children('h4').text('No. ' + $obj.siblings('.id-container').text())
        $todoDetailContainer.children('span').text($obj.siblings('.date').text())
        $todoDetailContainer.children('div').text($obj.siblings('label').text());
        $('#todo-detail').show();
    });
    $todoList.on('mouseleave', '#show-detail', function(){
        $('#todo-detail').hide();
    });

    $('.clear-completed').click(function(){
        if(confirm("완료된 목록을 전부 삭제하시겠습니까?")){
            $.ajax({
                url: '/api/todos',
                method: 'DELETE',
                success: function(){
                    $todoList.children('li.completed').remove();
                }
            }).fail(function(){
                alert('완료목록 전체 삭제에 실패했습니다. 잠시후 다시 시도해 주세요.');
            });
        }
    });

});
