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
    resave: true,
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

app.post("/admin-submit-booking", (req, res) => {
  const bookid = req.body.id;
  console.log(bookid);

  db.query(
    "UPDATE booking_details SET BOOKING_STATUS = 'C' WHERE BOOKING_ID = ?",
    bookid,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      } else {
        console.log("Sucess");
        res.status(200).json("Sucess");
      }
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
let logFlag;
app.post("/logout", (req, res) => {
  const flag = req.body.logoutFlag;
  if (flag === false) {
    // req.session.user = null;
    // req.session.destroy((err) => {
    //   res.redirect('/?page=ridex') // will always fire after session is destroyed
    // })
    req.session.cookie.expires = new Date().getTime();
  }

});


let Dlnum;
app.post("/profile", (req, res) => {
  Dlnum = req.body.Dlnum;
  isDel = req.body.isDel;
  if (isDel) {
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

let Dlnum1;
app.post("/profile-fetch", (req, res) => {
  Dlnum1 = req.body.Dlnum;
});

app.get("/profile", (req, res) => {
  const q = "SELECT * FROM customer_details WHERE DL_NUMBER = ?;";

  db.query(q, Dlnum1, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
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
      return res.json(data);
    }
  );


});




app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/logout", (req, res) => {
  if (req.session.user === null) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/dashboard/auth", (req, res) => {
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


  db.query(
    "SELECT EMAIL_ID,PASSWORD,DL_NUMBER,isAdmin FROM customer_details WHERE EMAIL_ID = ? AND PASSWORD = ? AND isAdmin =?;",
    [email, password, isAdmin],
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

app.post("/book", (req, res) => {

  const dlnum = req.body.dlnum;
  const fdate = req.body.fdate;
  const rdate = req.body.rdate;
  const carReg = req.body.carReg;
  const amount = req.body.amount;

  db.query(
    "INSERT INTO booking_details (FROM_DT_TIME,RET_DT_TIME,AMOUNT,BOOKING_STATUS,REG_NUM,DL_NUM) VALUES (?,?,?,'R',?,?)",
    [fdate, rdate, amount, carReg, dlnum],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      } else {
        console.log({ message: "Sucess" });
        res.json({ message: "Sucess" });
      }

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


//fetch user booking


let user_booking_id;
let userbooking_dl_num;
app.post("/my-bookings", (req, res) => {
  userbooking_dl_num = req.body.dl_num;
  


});


app.get("/my-bookings", (req, res) => {



  db.query(
    "SELECT car.*, booking_details.* FROM booking_details  INNER JOIN car ON car.REGISTRATION_NUMBER = booking_details.REG_NUM WHERE DL_NUM = ?"
    , userbooking_dl_num,
    (err, result) => {
      console.log(result);
      res.json(result);
    }
  );
});


app.get("/allbookings", (req, res) => {



  db.query(
    "SELECT car.*, booking_details.*,customer_details.* FROM booking_details  INNER JOIN car ON car.REGISTRATION_NUMBER = booking_details.REG_NUM INNER JOIN customer_details ON booking_details.DL_NUM = customer_details.DL_NUMBER"
    ,
    (err, result) => {
      console.log(result);
      res.json(result);
    }
  );
});


app.get("/admindashboard", (req, res) => {

  db.query(
    "SELECT * FROM customer_details"
    ,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.json(result);
      }
    }
  );
});


app.post("/admindashboard", (req, res) => {
  let Dlnum1 = req.body.Dlnum;


  db.query(
    "DELETE FROM customer_details WHERE DL_NUMBER = ?",
    Dlnum1,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      } else {
        res.status(200).json("Sucess");
      }
    }
  );


});

app.listen(3001, () => {
  console.log("MYSQL server running on port https://localhost:3001");
});
