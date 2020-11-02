const jsonServer = require("json-server");
const randomstring = require("randomstring");

var cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
var db = router.db;
const middlewares = jsonServer.defaults(true);
const port = 3000;

//server.use(bodyParser.json())
server.use(cors())
server.use(jsonServer.bodyParser);



server.post("/auth/register", (req, res) => {
  var data = {
    ...req.body,
    id: randomstring.generate(20),
  };

  const users = db.get("users");
  const result = users.find({ email: data.email }).value();
  if (result) {
    return res.status(409).json({
      message: `${data.email} already exists`,
    });
  } else {
    users.push(data).write();
    return res.send({
      message: "Register successfully !",
    });
  }
});

server.post("/auth/login",(req,res)=>{
  var data = req.body;
  const users = db.get("users");
  const result = users.find({ email: data.email }).value();
  if(!result){
    return res.status(404).json({
      message:"The account does not exist !",
    })
  }else{
    if(data.password === result.password){
      return res.json({
        message:"Login successfully !",
        accessToken : result.id
      })
    }else{
      return res.status(401).json({
        message:"Password incorrect !"
      })
    }
  }

})
server.post("/invoices", (req,res)=>{
 
  var data ={
    id: randomstring.generate(20),
    ...req.body
  }
  const invoices = db.get("invoices");
  try {
    invoices.push(data).write();
    return res.json({
      message:"Thanh thanh toán thành công"
    })
  } catch (error) {
    return res.status(500).json({
      message:"Đã xảy ra lỗi"
    })
  }
})



server.use(middlewares);
server.use(router);
server.listen(port);


