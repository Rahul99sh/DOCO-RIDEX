module.exports = mongoose => {
    const usersSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        password: { type: String, required: true },
        category: { type: String, required: true }
    });
    usersSchema.path('email').validate((val) => {
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
    }, 'Invalid e-mail.');

    const userModel = mongoose.model("Users", usersSchema);
  
    return userModel;
  };