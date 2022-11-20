const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 10,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "ridex"
});

app.post("/create-account", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const liscence = req.body.liscence;
  const city = req.body.city;
  const phone = req.body.phone;

  db.query(
    "INSERT INTO customer_details (DL_NUMBER,NAME,PHONE_NUMBER,EMAIL_ID,CITY,PASSWORD) VALUES (?,?,?,?,?,?)",
    [liscence, name, phone, email, city, password],
    (err, result) => {
      console.log(err);
      res.send({ err: err });
    }
  );

});

app.post("/update-profile", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const liscence = req.body.liscence;
  const city = req.body.city;
  const phone = req.body.phone;

  db.query(
    "UPDATE customer_details SET NAME = ?, PHONE_NUMBER =?, CITY = ?, PASSWORD =? Where DL_NUMBER = ?",
    [name, phone, city, password, liscence],
    (err, result) => {
      console.log(err);
      res.send({ err: err });
    }
  );

});
let Dlnum ;
app.post("/profile", (req, res) => {
  Dlnum = req.body.Dlnum;

  if(isDel){
    db.query(
      "DELETE FROM customer_details WHERE DL_NUMBER = ?",
      Dlnum,
      (err, result) => {
        console.log(err);
        res.send({ err: err });
      }
    );
  }

});



app.get("/profile", (req, res) => {

  const q = "SELECT * FROM customer_details WHERE DL_NUMBER = ?;";

  db.query(q, "E7521097", (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data);
    return res.json(data);

  }
  );

});

app.get("/dashboard", (req, res) => {

  
  if (filter == null) {


    db.query(
      "SELECT car.*, car_category.* FROM car  INNER JOIN car_category ON car.CAR_CATEGORY_NAME = car_category.CATEGORY_NAME WHERE AVAILABILITY_FLAG = 'A' ORDER BY MILEAGE",
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        console.log(data);
        return res.json(data);
      }
    );
  } else {
    db.query(
      "SELECT car.*, car_category.* FROM car  INNER JOIN car_category ON car.CAR_CATEGORY_NAME = car_category.CATEGORY_NAME WHERE CAR_CATEGORY_NAME = ? ORDER BY MILEAGE", filter,
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        console.log(data);
        return res.json(data);
      }
    );
  }



});


app.get("/home", (req, res) => {




  db.query(
    "SELECT car.*, car_category.* FROM car  INNER JOIN car_category ON car.CAR_CATEGORY_NAME = car_category.CATEGORY_NAME WHERE featured = 'y' ORDER BY MILEAGE",
    (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      console.log(data);
      return res.json(data);
    }
  );


});

// app.get("/dashboard#compact", (req, res) => {


//   db.query(
//     "SELECT car.*, car_category.* FROM car  INNER JOIN car_category ON car.CAR_CATEGORY_NAME = car_category.CATEGORY_NAME ORDER BY MILEAGE WHERE CAR_CATEGORY_NAME = 'COMPACT'",
//     (err, data) => {
//       if (err) {
//         console.log(err);
//         return res.json(err);
//       }
//       console.log(data);
//       return res.json(data);
//     }
//   );


// });


app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;
  const isDoco = req.body.isDoco;

  db.query(
    "SELECT EMAIL_ID,PASSWORD,DL_NUMBER,isAdmin FROM customer_details WHERE EMAIL_ID = ? AND PASSWORD = ? AND isAdmin =?;",
    [email, password,isAdmin],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {

        req.session.user = result;
        console.log(req.session.user);
        // if(isDoco === 'y'){
        //   res.send({message: "true"});
        // }
        return res.json(result);


      } else {
        console.log({ message: "User doesn't exist" });
        return res.json({ message: "User doesn't exist" });
      }
    }
  );
});

app.post("/booking/books", (req, res) => {
  
  const dlnum = req.body.dlnum;
  const fdate = req.body.fdate;
  const rdate = req.body.rdate;
  const status = req.body.status;
  const carReg = req.body.carReg;
  const amount = req.body.amount;

  db.query(
    "INSERT INTO booking_details (DL_NUM,FROM_DT_TIME,RET_DT_TIME,STATUS,AMOUNT,REG_NUM) VALUES (?,?,?,?,?,?)",
    [dlnum, fdate, rdate, status, amount, carReg],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      console.log({ message: "Sucess" });
      return res.json({ message: "Sucess" });
    }
  );

});

let reg;
app.post("/booking", (req, res) => {
  reg = req.body.reg;

});


let filter;
app.post("/dashboard", (req, res) => {
  filter = req.body.filter;

});


app.get("/booking", (req, res) => {



  db.query(
    "SELECT car.*, car_category.* FROM car  INNER JOIN car_category ON car.CAR_CATEGORY_NAME = car_category.CATEGORY_NAME WHERE REGISTRATION_NUMBER = ?"
    , reg,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {
        return res.json(result);


      } else {
        console.log({ message: "Car doesn't exist" });
        return res.json({ message: "Car doesn't exist" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("MYSQL server running on port https://localhost:3001");
});
