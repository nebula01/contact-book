var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // body-parser module를 bodyPaser 변수에 담습니다
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

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
// bodyParser로 stream의 form data를 req.body에 옮겨 담습니다. json data, urlencoded data를 분석해서 req.body를 생성합니다.
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 

// Port setting
app.listen(3000, function(){
  console.log("server on!");
});