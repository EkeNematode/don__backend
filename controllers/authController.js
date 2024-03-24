const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/authModel");
const expressAsyncHandler = require("express-async-handler");

// Register
exports.register = expressAsyncHandler((req, res) => {
  try {
    const { email, username, phone, university, role, password } = req.body;

    // validate
    if (!email || !username || !phone || !university || !role || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // check for existing user
    Auth.findOne({ phone: phone }).then((user) => {
      if (user) {
        return res.status(400).json({ message: "User already exists." });
      }
    });

    // create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        const newUser = new Auth({
          email,
          username,
          phone,
          university,
          role,
          password: hash,
        });

        newUser.save().then((user) => {
          jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone,
                university: user.university,
                role: user.role,
                balance: user.balance,
                token: generateToken(user._id),
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("clicked");

    // validate
    if (!phone || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const user = await Auth.findOne({ phone: phone });

    if (!user) {
      return res.status(400).json({ message: "No account with this phone." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      university: user.university,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFilteredUserByRole = expressAsyncHandler(async (req, res) => {
  try {
    console.log("clicker");
    const role = "vendor";
    const userData = await Auth.find({ role: role });

    if (!role) {
      res.status(400).json({ message: "Please fill add role" });
    }
    console.log(userData);

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(400).json({
        message: "Error occured",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update balamce of user
exports.updateBalance = expressAsyncHandler(async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await req.user;
    console.log(user);
    if (!balance) {
      res.status(400).json({ message: "Please fill in all fields." });
    }
    //balance to number
    const balanceToNumber = await parseInt(balance);
    const addBalance = (await user.balance) + balanceToNumber;
    const updatedBalance = await Auth.findByIdAndUpdate(
      user._id,
      { balance: addBalance },
      { new: true }
    );
    if (updatedBalance) {
      res.status(200).json({
        id: updatedBalance._id,
        email: updatedBalance.email,
        username: updatedBalance.username,
        phone: updatedBalance.phone,
        role: updatedBalance.role,
        university: updatedBalance.university,
        balance: updatedBalance.balance,
        token: generateToken(updatedBalance._id),
      });
    } else {
      res.status(400).json({
        message: "Error occured",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// deduct balance of user
exports.deductBalance = expressAsyncHandler(async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await req.user;
    console.log(user);
    if (!balance) {
      res.status(400).json({ message: "Please fill in all fields." });
    }
    //balance to number
    const balanceToNumber = parseInt(balance);
    if (balanceToNumber > user.balance) {
      res.status(400).json({ message: "Insufficient balance" });
    } else {
      const deductBalance = (await user.balance) - balanceToNumber;
      const updatedBalance = await Auth.findByIdAndUpdate(
        user._id,
        { balance: deductBalance },
        { new: true }
      );
      if (updatedBalance) {
        res.status(200).json({
          id: updatedBalance._id,
          email: updatedBalance.email,
          username: updatedBalance.username,
          phone: updatedBalance.phone,
          role: updatedBalance.role,
          university: updatedBalance.university,
          balance: updatedBalance.balance,
          token: generateToken(updatedBalance._id),
        });
      } else {
        res.status(400).json({
          message: "Error occured",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.updateVendorAvailability = expressAsyncHandler(async (req, res) => {
  try {
    const { available } = req.query;
    const user = await req.user;
    if (!available) {
      res.status(400).json({ message: "Please fill in all fields." });
    }
    const updatedAvailability = await Auth.findByIdAndUpdate(
      user._id,
      { available: available },
      { new: true }
    );
    if (updatedAvailability) {
      res.status(200).json({
        id: updatedAvailability._id,
        email: updatedAvailability.email,
        username: updatedAvailability.username,
        phone: updatedAvailability.phone,
        role: updatedAvailability.role,
        university: updatedAvailability.university,
        balance: updatedAvailability.balance,
        available: updatedAvailability.available,
        token: generateToken(updatedAvailability._id),
      });
    } else {
      res.status(400).json({
        message: "Error occured",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
