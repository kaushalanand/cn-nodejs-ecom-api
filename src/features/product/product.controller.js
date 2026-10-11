import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';

export default class ProductController {
  constructor(){
    this.productRepository = new ProductRepository();
  }


  async getAllProducts(req, res) {
    const products = await this.productRepository.getAll();
    res.status(200).send(products);
  }

  async addProduct(req, res) {
    const { name, price, sizes, categories } = req.body;
    const newProduct = {
      name,
      price: parseFloat(price),
      sizes: sizes.split(','),
      imageUrl: req.file.filename,
      category: categories
    };
    const createdRecord =
      await this.productRepository.add(newProduct);
    res.status(201).send(createdRecord);
  }

  async rateProduct(req, res, next) {
    console.log(req.query);
    try{
    const userID = req.query.userID;
    const productID = req.query.productID;
    const rating = req.querys.rating;
    await this.productRepository.rateProduct(
      userID,
      productID,
      rating
    );
    return res
      .status(200)
      .send('Rating has been added');
  
    }catch(err){
      console.log("Passing error to middleware");
      next(err);
    }
    }

  async getOneProduct(req, res) {
    const id = req.params.id;
    const product = await this.productRepository.get(id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      return res.status(200).send(product);
    }
  }

  async filterProducts(req, res) {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;
    const result = await this.productRepository.filter(
      minPrice,
      maxPrice,
      category
    );
    res.status(200).send(result);
  }

  async averagePrice(req, res, next){
    try {
      const result = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (error) {
      console.log(err);
      return req.status(400).send("Something went wrong!");
    }
  }
}
