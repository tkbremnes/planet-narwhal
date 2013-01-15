$(function(){

  var posts = [];

  function Post(postdata){
    this.title = postdata.title;
    this.thumbnail = postdata.thumbnail;

    this.data = postdata;

    posts.push(this);
    this.render();
  }
  Post.prototype.render = function() {
    var p = this;

    var post = document.createElement('article');
    post.className = 'post';

    var title = document.createElement('h1');
    title.innerHTML = this.title;

    var thumbnail = document.createElement('img');
    thumbnail.src = this.thumbnail;

    post.appendChild(thumbnail);
    post.appendChild(title);

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
    var header = document.createElement('header');
    var title = document.createElement('h1');
    var selftext = document.createElement('div');

    var encodedStr = post.data.selftext_html;
    $(selftext).html(_.unescape(encodedStr));
    header.appendChild(title);
    header.appendChild(selftext);
    title.innerHTML = post.data.title;

    document.getElementById('comments').appendChild(header);

    var dest = document.createElement('ul');
    dest.id = 'comments-dest';
    dest.innerHTML = 'fetching comments ...';

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


});