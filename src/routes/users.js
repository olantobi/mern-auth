import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import User from '../models/User';

dotenv.config();

const router = express.Router();
const secretKey = process.env.SECRET_KEY;

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(409).json('Email already exists');
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (error, hash) => {
        if (error) throw error;

        newUser.password = hash;
        newUser.save()
          .then(savedUser => res.json(savedUser))
          .catch(saveError => console.log(saveError));
      });
    });
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json('Invalid email/password');
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json('Invalid email/password');
      }

      console.log('Secret', secretKey);
      const payload = { id: user.id, name: user.name };
      jwt.sign(payload, secretKey, { expiresIn: 86400 }, (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        console.log('Token', token);
        res.json({ success: true, token: 'Bearer '+ token });
      });
    });
  });
});

router.get('/:email', (req, res) => {
  const { email } = req.params;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json('Email address doesn\'t exist');
    }

    return res.json({ sucess: true, user });
  });
});

export default router;
