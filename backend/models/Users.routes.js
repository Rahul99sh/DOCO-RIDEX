module.exports = app => {
    const users = require("./controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/doco/create-account", users.create);
  
    // Retrieve all users
    // router.get("/", users.findAll);
  
    // Retrieve all published users
    // router.get("/published", users.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.post("/doco/login", users.findOne);
    router.get("/doco/login", users.findUser);
    router.get("/doco/admin-dashboard", users.findAllUser);
    router.post("/doco/admin-dashboard", users.delete);
  
    // Update a Tutorial with id
    // router.put("/:id", users.update);
  
    // Delete a Tutorial with id
    // router.delete("/:id", users.delete);
  
    // Create a new Tutorial
    // router.delete("/", users.deleteAll);
  
    app.use('/', router);
  };