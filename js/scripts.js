
$(function(){
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  var posts = [];

  function Post(postdata){
    this.title = postdata.title;
    this.thumbnail = postdata.thumbnail;

    this.data = postdata;

    this.template = $('#template-post').html();

    posts.push(this);
    this.render();
  }
  Post.prototype.render = function() {


    var p = this;

    var post = document.createElement('article');
    post.className = 'post';

    post.innerHTML = _.template(this.template, this.data);

    document.getElementById('posts').appendChild(post);


    $(post).click(function(){
      document.getElementById('comments').innerHTML = '';
      renderComments(p);
    });

  }
  Post.prototype.destroy = function() {
    // TODO
  }


  var comments = [];
  function Comment(data){
    this.data = data;
    comments.push(this);
    this.render();
  }
  Comment.prototype.render = function() {
    var c = this;

    var li = document.createElement('li');
    var comment = document.createElement('article');
    var author = document.createElement('p');
    var body = document.createElement('p');

    //var replies = documnet.createElement('p');

    author.innerHTML = this.data.author;
    author.className = 'author';
    body.innerHTML = _.unescape(this.data.body_html);
    body.className = 'body';
    //replies.innerHTML = this.data.replies.data.children.length + ' replies';
    //replies.className = 'replies';

    comment.appendChild(author);
    comment.appendChild(body);
    //comment.appendChild(replies);

    comment.className = 'comment';

    li.appendChild(comment);

    document.getElementById('comments-dest').appendChild(li); 

    $(comment).click(function(){
      alert(JSON.stringify(c));
    });
  }



  function renderComments(post){
    // Slides the comments into view

    var widthQuery = window.matchMedia("(max-width: 1024px)");
    
    if(widthQuery.matches) {
      $('#comments').css('left', '0');
      $('#posts').css('left', '-100%');
    }




    var section = document.createElement('section')
    section.setAttribute('role', 'region');
    section.className = 'skin-organic';
    var header = document.createElement('header');
    var title = document.createElement('h1');
    var selftext = document.createElement('h2');

    var encodedStr = post.data.selftext_html;
    $(selftext).html(_.unescape(encodedStr));

    var h = document.createElement('header');

    var bck = document.createElement('button');
    $(bck).css('display', 'none');


    // The button should not show in tablet mode
    $(bck).on('click', function(){
      $('#comments').css('left', '100%');
      $('#posts').css('left', '0');
        
      // don't think I'll need it
      // $('#comments').empty();
    });

    bck.innerHTML = '<span class="icon icon-back">back</span>';


    h.appendChild(bck);

    header.appendChild(section);
    h.appendChild(title);
    section.appendChild(h);

    var subh = document.createElement('header');

    subh.appendChild(selftext);
    section.appendChild(subh);
    title.innerHTML = post.data.title;

    document.getElementById('comments').appendChild(header);

    var dest = document.createElement('ul');
    dest.id = 'comments-dest';

    
    dest.innerHTML = '<section role="region"><p role="status"><progress></progress><span>Loading comments</span></p></section>';

    document.getElementById('comments').appendChild(dest);

    $.getJSON('http://www.reddit.com/' + post.data.permalink + '.json?jsonp=?',
      function(data){
        //first element contains the post data
        //second element contains the actual comments

        document.getElementById('comments-dest').innerHTML = ''; 

        data[1].data.children.forEach(function(element){
          new Comment(element.data);
        });
      }
    );
  }

  $.getJSON('http://www.reddit.com/r/iama.json?jsonp=?',
    function(data){
      console.log(data);

      data.data.children.forEach(function(element){
        new Post(element.data);
      });
    }
  );


  var opened = false;
  $('#menu-button').on('click', function(){
    if(opened) {
      $('#posts').css('margin-left', '0');
      $('#drawer').css('left', '-300px');
    }
    else {
      $('#posts').css('margin-left', '300px');
      $('#drawer').css('left', '0');
    }
    opened = !opened;
  });


});