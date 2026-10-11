import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {
  constructor(){
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const {
        name,
        email,
        password,
        type,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(
        name,
        email,
        hashedPassword,
        type
      );

      await this.userRepository.signUp(user)
      res.status(201).send(user);
    } catch (error) {
      next(error)
      // return res.status(200).send("Something went wrong!");
    }
    
  }

  async signIn(req, res, next) {
    try {
        const user = await this.userRepository.findByEmail(req.body.email);

        if(!user){
          return res
            .status(400)
            .send('Incorrect Credentials');
        }else{
          const result = await bcrypt.compare(req.body.password, user.password);

          if(result){
            // 1. Create token.
            const token = jwt.sign(
              {
                userID: result.id,
                email: result.email,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: '1h',
              }
            );
            // 2. Send token.
            return res.status(200).send(token);
          }else{
            return res
            .status(400)
            .send('Incorrect Credentials');
          }
        }

      }catch (error) {
        next(error)
        // return res.status(200).send("Something went wrong!");
      }
  }

  async resetPassword(req,res, next){
    const {newPassword} = req.body;
    const userID = req.userID;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is reset!")
    } catch (error) {
      next(error)
      // return res.status(200).send("Something went wrong!");
    }
  }
}
