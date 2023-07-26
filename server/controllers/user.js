import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // to store the user in browser for some period of time

// now we first need to create user model
import User from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body; // first we get email/pw from the body and we destructure it

  try {
    const oldUser = await User.findOne({ email }); // then we find the existing user in the database

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // then we check for the password and we cannot simply compare strings here because we are using bcrypt to hash the password
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

    // if the pw is correct then we get his jwt that we need to send to the frontend
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'test', { expiresIn: "1h" });
    // the second argument to the jwt sign is the secret, a secret string usually

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if(oldUser) return res.status(400).json({ message: "User already exists" });

    if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12) // 12 here tell the level of hashing to be done

    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, 'test', { expiresIn: "1h" } );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

// now our backend need to let this signin/signup user do all kinds of activities for that middleware is created