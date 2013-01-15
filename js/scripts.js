$(function(){



  $.getJSON('http://www.reddit.com/r/pics.json?jsonp=?',
    function(data){
      console.log(data);

      data.data.children.forEach(function(element){
        var img = document.createElement('img');
        img.src = element.data.thumbnail;

        document.getElementById('dest').appendChild(img);
      });
    }
  );


});