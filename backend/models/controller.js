const db = require("../models");
const Users = db.Users;




// Create and Save a new Tutorial
exports.create = (req, res) => {
    console.log("reqq to create user");
    // Validate request
    if (!req.body.name) {
        res.status(400).json({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tutorial
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        category: req.body.category
    });

    // Save Tutorial in the database
    user
        .save(user)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while registring user."
            });
        });

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

    const name = req.query.name;

    Users.find(name)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        })

};


let vify;
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    
    const id = req.body.email;
    const password = req.body.password;

    Users.findOne({email : id})

        .then(data => {
            if (!data){
                res.status(404).send("User does not exists with this email ");
                console.log("User does not exists with this email");
            }
            if(data) {
                if (data.password === password) {
                    vify=true;
                    res.json(data);
                } else {
                    res
                        .status(600)
                        .send( "Incorrect Password" );
                    console.log("Incorrect Password");
                }
            }
        })
        .catch(err => {
            res
                .status(500)
                .send("Error retrieving User");
                console.log(err);
        });

};

exports.logout = (req, res) => {
  console.log("verify to login");
  

  vify=false;

};


exports.findUser = (req, res) => {
    console.log("verify to login");
    

    if (vify) {
        res.send({ loggedIn: true });
      } else {
        res.send({ loggedIn: false });
      }

};

// Update a Tutorial by the id in the request
exports.findAllUser = (req, res) => {
    Users.find()
    .then(data => {
      res.json(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.body.email;
    const name = req.body.name;
    console.log("delete request");
  Users.deleteOne({email : id , name : name})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.status(200).send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};