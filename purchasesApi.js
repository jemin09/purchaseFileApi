let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

let fs=require("fs");
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app Listening on port ${port}`));
let {dataJson}=require("./shopData.js");
let fname="store.json";


app.get("/purchases",function(req,res){
  let product=req.query.product;
  let shop=+req.query.shop;
  let sort=req.query.sort;
  let productArr=[]; 
  console.log("product",product,shop);
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let purchaseArr=JSON.parse(data);
      let purchases=purchaseArr.purchases;
      // console.log("purchases",purchases)
      if(product){
        productArr=product.split(",")
        purchases=purchases.filter(pur=>productArr.find(p=>+p===pur.productid))
      }
      if(shop){
        purchases=purchases.filter(pur=>shop===pur.shopId);
      }
      if(sort==="QtyAsc"){
        purchases=purchases.sort((p1,p2)=>p1.quantity-p2.quantity);
      }
      if(sort==="QtyDesc"){
        purchases=purchases.sort((p1,p2)=>p2.quantity-p1.quantity);
      }
      if(sort==="ValueAsc"){
        purchases=purchases.sort((p1,p2)=>(p1.quantity*p1.price)-(p2.quantity*p2.price));
      }
      if(sort==="ValueDesc"){
        purchases=purchases.sort((p1,p2)=>(p2.quantity*p2.price)-(p1.quantity*p1.price));
      }
      let allData={};
      allData["purchases"]=purchases;
      let arr=[];
      purchaseArr.products.map(p=>arr.push(p.productId));
      allData["productOpt"]=arr;
      arr=[];
      purchaseArr.shops.map(p=>arr.push(p.shopId));
      allData["shopOpt"]=arr;
      arr=[];
      // console.log("allData",allData);
      res.send(allData);
    }        
  });
});

app.get("/totalPurchase/shop/:id",function(req,res){
  let id=req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      // console.log("dataArr",dataArr)
      let shops=dataArr.purchases.filter(p=>p.shopId===+id);
      console.log("dataArr",shops)
      // let shops=shopjson.
      
      let ids=[];
      let totalPurArr=[];

      shops.map(s=>{
        console.log("in shops map",s.productid)
        let st={};
        let index=ids.findIndex(i=>i===+s.productid);
        console.log("index",index,"ids",ids);
        if(index===-1) {
          ids.push(s.productid);
          let arr=shops.filter(sp=>sp.productid===s.productid);
          // console.log("arr",arr)
          st["totalpurchase"]=arr.length;
          st["productid"]=s.productid;
          st["shopId"]=id;
          st["shopname"]=dataArr.shops.find(p=>p.shopId===+id).name;
          st["productname"]=dataArr.products.find(p=>p.productId===s.productid).productName;
          console.log("st",st)
          totalPurArr.push(st);
        }
      });  
      dataArr["totpurchaseShop"]=totalPurArr;
      let data1=JSON.stringify(dataArr);
      fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(totalPurArr);
      })    
    }        
  }); 
});
app.get("/totalPurchase/product/:id",function(req,res){
  let id=req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      // console.log("dataArr",dataArr)
      let products=dataArr.purchases.filter(p=>p.productid===+id);
      console.log("dataArr",products)
      // let shops=shopjson.
      
      let ids=[];
      let totalPurArr=[];

      products.map(s=>{
        console.log("in shops map",s.shopId)
        let st={};
        let index=ids.findIndex(i=>i===+s.shopId);
        console.log("index",index,"ids",ids);
        if(index===-1) {
          ids.push(s.shopId);
          let arr=products.filter(sp=>sp.shopId===s.shopId);
          // console.log("arr",arr)
          st["totalpurchase"]=arr.length;
          st["productid"]=id;
          st["shopId"]=s.shopId;
          st["shopname"]=dataArr.shops.find(p=>p.shopId===s.shopId).name;
          st["productname"]=dataArr.products.find(p=>p.productId===+id).productName;
          console.log("st",st)
          totalPurArr.push(st);
        }
      });  
      dataArr["totpurchaseproduct"]=totalPurArr;
      let data1=JSON.stringify(dataArr);
      fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(totalPurArr);
      })    
    }        
  }); 
});
app.get("/purchases/products/:id",function(req,res){
  let id=req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      console.log("dataArr",dataArr)
      let products=dataArr.purchases.filter(p=>p.productid===+id);
      let allData={};
      allData["purchases"]=products;
      let arr=[];
      dataArr.products.map(p=>arr.push(p.productId));
      allData["productOpt"]=arr;
      arr=[];
      dataArr.shops.map(p=>arr.push(p.shopId));
      allData["shopOpt"]=arr;
      arr=[];
      console.log("allData",allData);
      res.send(allData);
    }        
  }); 
});
app.get("/purchases/shops/:id",function(req,res){
  let id=req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      console.log("dataArr",dataArr)
      let shops=dataArr.purchases.filter(p=>p.shopId===+id);
      let allData={};
      allData["purchases"]=shops;
      let arr=[];
      dataArr.products.map(p=>arr.push(p.productId));
      allData["productOpt"]=arr;
      arr=[];
      dataArr.shops.map(p=>arr.push(p.shopId));
      allData["shopOpt"]=arr;
      arr=[];
      console.log("allData",allData);
      res.send(allData);
    }        
  }); 
});
app.post("/shops",function(req,res){
  let body=req.body;
  console.log("body=",body)
  fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
      let shopArr=JSON.parse(data);
      console.log("shopArr",shopArr);
      let len=shopArr.shops.length;
      let newShop={...body};
      newShop["shopId"]=+shopArr.shops[len-1].shopId+1;
      shopArr.shops.push(newShop);
      let data1=JSON.stringify(shopArr);
      fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(newShop);
      })
    }
  })
});
app.post("/products",function(req,res){
  let body=req.body;
  console.log("body=",body)
  fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      console.log("dataArr",dataArr);
      let len=dataArr.products.length;
      let newproduct={...body};
      newproduct["productId"]=+dataArr.products[len-1].productId+1;
      dataArr.products.push(newproduct);
      let data1=JSON.stringify(dataArr);
      fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(newproduct);
      })
    }
  })
});
app.post("/purchases",function(req,res){
  let body=req.body;
  console.log("body=",body)
  fs.readFile(fname,"utf8",function(err,data){
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      console.log("dataArr",dataArr);
      let len=dataArr.purchases.length;
      let newpurchase={...body};
      newpurchase["purchaseId"]=+dataArr.purchases[len-1].purchaseId+1;
      dataArr.purchases.push(newpurchase);
      let data1=JSON.stringify(dataArr);
      fs.writeFile(fname,data1,function(err){
        if(err) res.status(404).send(err);
        else res.send(newpurchase);
      })
    }
  })
});
app.get("/resetData",function(req,res){
  let data=JSON.stringify(dataJson);
  fs.writeFile(fname,data,function(err){
    if(err) res.status(404).send(err);
    else res.send("Data in file is reset");
  })
});
// app.get("/purchases",function(req,res){
//   fs.readFile(fname,"utf8",function(err,data) {
//     if(err) res.status(404).send(err);
//     else{
//       let purchaseArr=JSON.parse(data);
//       let purchases=purchaseArr.purchases;
//       res.send(purchases);
//     }        
//   });
// });
app.get("/shops",function(req,res){
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let shopArr=JSON.parse(data);
      console.log("shopArr",shopArr)
      let shops=shopArr.shops;
      res.send(shops);
    }        
  }); 
});
app.get("/products",function(req,res){
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let productArr=JSON.parse(data);
      console.log("product",productArr)
      let products=productArr.products;
      res.send(products);
    }        
  }); 
});
app.put("/products/:proname",function(req,res){
  let proname=req.params.proname;
  let body=req.body;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let productArr=JSON.parse(data);
      // console.log("product",productArr)
      let index=productArr.products.findIndex(p=>p.productName===proname);
      console.log("index",index)
      if(index>=0){
        let updatedProduct={...productArr.products[index],...body};
        productArr.products[index]=updatedProduct;
        let data1=JSON.stringify(productArr);
        fs.writeFile(fname,data1,function(err){
          if(err) res.status(404).send(err);
          else res.send(updatedProduct);
        })
      }
    }        
  });
})

app.get("/products/:productName",function(req,res){
  let productName=req.params.productName;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else{
      let dataArr=JSON.parse(data);
      console.log("dataArr",dataArr)
      let product=dataArr.products.filter(p=>p.productName===productName);
      res.send(product);
    }        
  }); 
});
