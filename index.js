const express = require('express'); 
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
//console.log(process.env.DB_PWD);

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

//the next two lines are to load get/post data in JSON form
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

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

//product page - add product to cart
app.post("/product/submit", async(request,response)=>{
  let productId = request.body.productId;
  //console.log(productId);
  let selectedProduct = {
    selectedProductId: productId
  }
  await addToCart(selectedProduct);
  response.redirect("/product");
})

//contact page
app.get("/contact", async (request, response)=>{
  let links = await getLinks();
  response.render("contact", { title: "Contact", menu:links });
})

//contact insert new message
app.post("/contact/submit", async (request, response)=>{
  let Name = request.body.fullname;
  let Email = request.body.email;
  let Message = request.body.message;
  
  let newmessage = {
    customerName: Name,
    email: Email,
    message: Message
  };
  await addMessage(newmessage);
  response.redirect("/contact");
})

//cart page
app.get("/cart", async (request, response)=> {
  let links = await getLinks();
  //let addedProduct = await displayCart();
  //console.log(addedProduct[0].selectedProductId);
  let addedProduct = await findBeadDetail();
  console.log(addedProduct);
  response.render("cart", {title:"cart", menu:links, cart:addedProduct });
})

//server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

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

  //async function add to cart
  async function addToCart(selectedProduct){
    db=await connection();
    let status = await db.collection("Cart").insertOne(selectedProduct);
    console.log("product added");
  }

  //async functions Contact
  async function addMessage(newmessage) {
    db = await connection();
    let status = await db.collection("Contact").insertOne(newmessage);
    console.log("new message added");
  }

  //async function cart
  async function displayCart(){
    db=await connection();
    var cartresults = db.collection("Cart").find({});
    res=await cartresults.toArray();
    return res;
  }

  //async function - find product detail using productId from cart collection
  async function findBeadDetail(){
    db=await connection();
    let beadId = await displayCart();

    //console.log(selectedId.product2);
    const selectedP1 = {_id: new ObjectId(beadId[0].selectedProductId)};
    let displayProduct1 = await db.collection("BeadsInfo").findOne(selectedP1);
    const selectedP2 = {_id: new ObjectId(beadId[1].selectedProductId)};
    let displayProduct2 = await db.collection("BeadsInfo").findOne(selectedP2);
 
    //var productDetail = db.collection("BeadsInfo").find({selectedId})
    //res=await productDetail.toArray();
    //return res;

    let finalProduct = {
      dProduct1: displayProduct1,
      dProduct2: displayProduct2,
    }
    return finalProduct;
  }

  /*
  let finalBeadId = [];
  for(let i=0; i<beadId.lengthl; i++){
    
    finalBeadId.push(beadId[i].selectedProductId);
    
  }
  console.log(finalBeadId);
  const selectedP1 = {_id: new ObjectId(finalBeadId[0])};
  let displayProduct1 = await db.collection("BeadsInfo").findOne(selectedP1);
  const selectedP2 = {_id: new ObjectId(finalBeadId[1])};
  let displayProduct2 = await db.collection("BeadsInfo").findOne(selectedP2);
  let finalProduct = {
    dProduct1: displayProduct1,
    dProduct2: displayProduct2,
  }
  return finalProduct;
  }*/