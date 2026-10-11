import { LikeRepository } from "./like.repository";

export class LikeController{
    constructor(){
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req, res, next){
        try {
            const {id, type} = req.body;
            const userId = req.userId;
            if(type != 'Product' && type != 'Category'){
                return res.status(400).send("Invalid Type!");
            }

            if(type == 'Product'){
                this.likeRepository.likeProduct(userId, id);
            }else{
                this.likeRepository.likeCategory(userId, id);
            }

            res.status(201).send("Like is added!");
        } catch (error) {
            console.log(error);
            return res.status(200).send("Something went wrong!");
        }
    }

    async getLikes(req,res, next){
        try {
            const {id, type} = req.query;
            const likes = await this.likeRepository.getLikes(type, id);

            res.status(201).send(likes);
        } catch (error) {
            console.log(error);
            return res.status(200).send("Something went wrong!");
        }
    }
}