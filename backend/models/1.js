router.post(`/login`, async (req, res) => {
    const { email, password } = req.body
  
    if (!email || !password) {
      res.status(400).json({ msg: 'Something missing' })
    }
  
    const user = await UserSchema.findOne({ email: email }) // finding user in db
    if (!user) {
      return res.status(400).json({ msg: 'User not found' })
    }
  
    const matchPassword = await bcrypt.compare(password, user.password)
    if (matchPassword) {
      // ------- NEW CODE HERE
      const userSession = { email: user.email } // creating user session to keep user loggedin also on refresh
      req.session.user = userSession // attach user session to session object from express-session
  
      return res
        .status(200)
        .json({ msg: 'You have logged in successfully', userSession }) // attach user session id to the response. It will be transfer in the cookies
    } else {
      return res.status(400).json({ msg: 'Invalid credential' })
    }
  })