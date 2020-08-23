var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mong       = require('mongoose'),
    methodOverride = require('method-override');

mong.connect('mongodb://localhost:27017/blog-app-colt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mong.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mong.model("Blog", blogSchema);

app.get('/', (req, res) => {
    res.redirect("/blogs");
})

app.get('/blogs', (req, res) => {
    
    Blog.find({}).then((blogs)=>{
        res.render("blogs", {blogs: blogs});
    }).catch((err) => console.log(err));

});


/*   */

/* <% for(var i = 0; i < blogs.length; i++){ %>
    <h2><%= blogs[i].title %></h2>
<% } %>
 */
app.get('/blogs/new', (req, res) => {
    res.render("new");
});

/* Blog.create({
    title: "Doggo No.1",
    image: "https://www.thenewsminute.com/sites/default/files/styles/news_detail/public/Jade_main_two.jpg?itok=-1pAGk5q",
    body: "This Doggo."
}).then((doggo) => {
    console.log("It worked!", doggo);
}).catch((err) => {
    console.log("there was an error", err);
}); */

app.post('/blogs/new', (req, res) => {
    /* var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var created = req.body.created; */
    Blog.create(req.body.blog).then((doggo) => {
        console.log("It worked!", doggo);
        res.redirect('/blogs');
    }).catch((err) => {
        console.log("there was an error", err);
        res.render('new');
    });
    //res.send('post blogs/new')
});


//video 317
app.get('/blogs/:id', (req, res)=>{
    console.log("show route hit")
    console.log(req.params.id)
    Blog.findById(req.params.id).then((blog)=>{
        res.render('show', {blog: blog});
    }).catch((err) => {
        console.log("There was an error", err);
        res.redirect('/blogs');
    })

})

// Edit Blog Page Route
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id).then((blog) => {
        res.render('edit', {blog}); 
    }).catch((err) => console.log("there was an error: ", err));
    
})

// Update Blog Route 
app.put('/blogs/:id', (req, res) => {
    console.log("*****************")
    console.log("hit the update put route")
    console.log("*****************")
    Blog.findByIdAndUpdate(req.params.id, req.body.blog).then(()=>{
        Blog.findById(req.params.id).then((blog) => {
            res.render('show', {blog});
        }).catch((err) => console.log('this was an error fetchign to show: ', err));
    }).catch((err) => console.log('there was an error updating', err ));

});

/* app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server IS RUNNING");
    console.log(process.env.PORT);
}) */

app.listen(3000, function(){
    console.log("Server IS RUNNING");
    console.log(process.env.PORT);
})