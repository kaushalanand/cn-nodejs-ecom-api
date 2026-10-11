import CartIemModel from './cartItems.model.js';
import CartItemRepository from './cartItem.repository.js';

export class CartItemsController {
  constructor(){
    this.cartItemRepository = new CartItemRepository();
  }

  add(req, res) {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    this.cartItemRepository.add(productID, userID, quantity);
    res.status(201).send('Cart is updated');
  }

  get(req, res) {
    const userID = req.userID;
    const items = this.cartItemRepository.get(userID);
    return res.status(200).send(items);
  }

  delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const isDeleted = this.cartItemRepository.delete(
      cartItemID,
      userID
    );
    if (isDeleted) {
      return res.status(404).send("Item not found!");
    }
    return res
      .status(200)
      .send('Cart Item is removed');
  }
}
