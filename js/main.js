let thought = {};
$(document).ready(function(){
  $('#addDiv').hide();
  $.ajax({
    type: 'GET',
    url: 'http://localhost:7000/thoughts/list',
    dataType: 'json',
    success: function(data){
      $.each(data, function(i, thought){
        buildTable(thought);
      });
    },
    error: function(error){
      alert('Error');
    }
  })
});


function buildTable(thought){
  var $table = $('#thoughtsTable');
  var $tableRow = $('<tr id = '+thought.id+'>'+
                      '<td><input type="text" name="id" value ="' + thought.id + '" readonly></input></td>'+
                      '<td><input type="text" name="description" value ="' + thought.description + '" readonly></input></td>'+
                      '<td><input type="text" name="time" value = "' + thought.remindTime + '" readonly></input></td>'+
                      '<td><button title="edit" onclick="onEdit('+ thought.id + ')"> <span class="material-icons sizeIcon">edit</span></button>'
                          + '<button title="delete" onclick="onDelete('+ thought.id + ')"> <span class="material-icons sizeIcon" title="delete">delete</span></button>'
                          + '</td>' +
                    '</tr>'
                  );
  $table.append($tableRow);
}

function extractThought(id){
  var $row = $('#'+id);
  var $columns = $row.find('td');
  var values = "";
  var cols = ['id', 'description', 'remindTime'];
  var thought = {'id' : undefined, 'description': undefined, 'remindTime': undefined};
  $.each($columns, function(i, item) {
      if(i < 3){
        $td = $(item.innerHTML);
        console.log($td.val());
        thought[cols[i]] = $td.attr('value');
      }
  });
  return thought;
}

function onEdit(id){
  thought = extractThought(id);
  $('#thoughtEditName').val(thought.description);
  $('#remindEditTime').val(thought.remindTime);
  $('#myModal').modal('show');
}

function onEditSubmit(id){
    editThought(extractThought(id));
}

function onDelete(id){
  deleteThought(extractThought(id));
}

function onAdd(){
  $('#thoughtName').val('').focus();
  $('#remindTime').val('');
  $('#addDiv').show();
  $('input[name=thoughtName]').focus();
}

function addThought(){
  var id = new Date().getTime();
  var description = document.getElementById('thoughtName').value ;
  var remindTime = document.getElementById('remindTime').value ;
  var tempThought = {
    'id': id,
    'description': description,
    'remindTime': remindTime
  }

  $.ajax({
    url: 'http://localhost:7000/thoughts/create',
    type: 'POST',
    data: JSON.stringify(tempThought),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success: function(msg) {
      $('#addDiv').show();
    }
  })
}

function deleteThought(thought){
  $.ajax({
    url: 'http://localhost:7000/thoughts/delete/'+ thought.id,
    type: 'DELETE',
    data: JSON.stringify(thought),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function(msg) {
        location.reload();
    }
  })
}

function editThought(){
  var name = document.getElementById('thoughtEditName').value ;
  var time = document.getElementById('remindEditTime').value ;
  thought.description = name;
  thought.remindTime = time;
  $.ajax({
    url: 'http://localhost:7000/thoughts/update/' + thought.id,
    type: 'PUT',
    data: JSON.stringify(thought),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success: function(msg) {
    }
  })
}
