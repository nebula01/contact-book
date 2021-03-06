var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // body-parser module를 bodyPaser 변수에 담습니다
var methodOverride = require("method-override"); //form은 get과 post 만을 허용하고 나머지는 허용하지 않습니다. method override package를 설치하여 이를 우회
var app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB, { useMongoClient: true });
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

// Other settings // ejs선언은 선행 되어야 함
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
// bodyParser로 stream의 form data를 req.body에 옮겨 담습니다. json data, urlencoded data를 분석해서 req.body를 생성합니다.
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride("_method"));

// mongoose.Schema 함수를 사용해서 schema object를 생성합니다.
var contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
 });
 var Contact = mongoose.model("contact", contactSchema); //5

app.get("/", function(req,res){
  res.redirect("/contacts");
});

app.get("/contacts", function(req, res){
  Contact.find({}, function(err, contacts){
   if(err) return res.json(err);
   res.render("contacts/index", {contacts:contacts});
  })
 });
 // Contacts - New // 8
 app.get("/contacts/new", function(req, res){
  res.render("contacts/new");
 });
 // Contacts - create // 9
 app.post("/contacts", function(req, res){
  Contact.create(req.body, function(err, contact){
   if(err) return res.json(err);
   res.redirect("/contacts");
  });
 });
// show
 app.get("/contacts/:id", function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
   if(err) return res.json(err);
   res.render("contacts/show", {contact:contact});
  });
 });
 // Contacts - edit // 4 
 app.get("/contacts/:id/edit", function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
   if(err) return res.json(err);
   res.render("contacts/edit", {contact:contact});
  });
 });
 // Contacts - update // 5 
 app.put("/contacts/:id", function(req, res){
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
   if(err) return res.json(err);
   res.redirect("/contacts/"+req.params.id);
  });
 });
 // Contacts - destroy // 6
 app.delete("/contacts/:id", function(req, res){
  Contact.remove({_id:req.params.id}, function(err, contact){
   if(err) return res.json(err);
   res.redirect("/contacts");
  });
 });
 

// Port setting
app.listen(3000, function(){
  console.log("server on!");
});