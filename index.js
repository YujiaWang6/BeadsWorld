const express = require('express'); 
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.DB_PWD);

const app = express();
const port = process.env.PORT || "4321";

//mangoDB stuff
const { MongoClient, ObjectId }= require("mongodb");
const { response } = require("express");


const dbUrl = "mongodb+srv://assignment1:RGvJDsejdgj9duTW@cluster0.cijlb2g.mongodb.net/";
//const dbUrl = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.cijlb2g.mongodb.net/";

const client = new MongoClient(dbUrl);

app.set("views", path.join(__dirname, "views"));
app.set("view engine","pug");

app.use(express.static(path.join(__dirname,"public")));


//home page 
app.get("/", async (request, response) => {
  let links = await getLinks();
  //console.log(links);
    response.render("index", { title: "Home", menu:links });
  });

//product page 
app.get("/product", async (request, response) =>{
  let links = await getLinks();
  let beads = await getBeadDetails();
  response.render("product", { title: "Products", menu:links, product:beads });

})

//contact page
app.get("/contact", async (request, response)=>{
  let links = await getLinks();
  response.render("contact", { title: "Contact", menu:links });
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });

//about page
app.get("/cart", async (request, response)=> {
  let links = await getLinks();
  response.render("cart", {title:"cart", menu:links});
})

  //async functions Menu
  async function connection() { 
    await client.connect();
    db = client.db("BeadsWorld"); 
    return db;
    }

    async function getLinks() {
      db = await connection();
      var results = db.collection("Menu").find({}); //find({}) is select all
      res = await results.toArray();
      return res;
      }

  //async functions Beads
  async function getBeadDetails(){
    db=await connection();
    var beadresults = db.collection("BeadsInfo").find({});
    res = await beadresults.toArray();
    return res;
  }