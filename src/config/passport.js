import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import momgoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const User = momgoose.model('users');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    }),
  );
};
