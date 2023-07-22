import RESTapi from './RESTapi';

export default class CartStorage {
  static storage_key = 'USER_CART';

  static async setCartStorage() {
    try {
      const response = await RESTapi.fetchCartData();

      if (response.getCart) {
        const listOfObjects = response.data.items;
        const newFormat = {
          product_id: '',
          property: {
            product_name: '',
            product_photo: '',
            product_url_name: '',
            option: {},
            product_price: 0,
            quantity: 1,
            totalPrice: 0,
            priceChange: { discount: 0 },
          },
          validator: { isStock: false },
          note: '',
        };
        console.log('listOfObjects', listOfObjects);

        const updatedList = listOfObjects.map((obj) => {
          const newItem = { ...newFormat.property }; // Create a copy of the newFormat.item object

          // Copy the properties from the original object to the newItem
          newItem._id = obj._id;
          newItem.product_name = obj.product_name;
          newItem.product_photo = obj.product_photo[0];
          newItem.product_url_name = obj.product_url_name;
          newItem.option = obj.option || {}; // Use an empty object if option is null
          newItem.product_price = obj.product_price;

          return {
            product_id: obj._id,
            property: newItem,
            validator: { ...newFormat.validator },
            note: '',
          };
        });
        console.log(updatedList);
        localStorage.setItem(this.storage_key, JSON.stringify(updatedList));
      }
      return { getCart: response.getCart, message: response.message };
    } catch (error) {
      console.error('Error setting cart data from database:', error);
      return {
        getCart: error.getCart,
        message: error.message,
      };
    }
  }

  static async addToCart(productData) {
    const oldCartData = await JSON.parse(
      localStorage.getItem(this.storage_key)
    );
    console.log(oldCartData);
    const newProductId = productData.product_id;
    console.log('newProductId', newProductId);
    const newCartData = [...oldCartData, productData];

    localStorage.setItem(this.storage_key, JSON.stringify(newCartData));
    try {
      await RESTapi.addToCart(newProductId);
      return {
        addToCart: true,
        message: 'Product added to cart successfully.',
      };
    } catch (error) {
      return { addToCart: false, message: 'Error adding product to cart.' };
    }
  }

  static async modifyCart(cartData) {
    try {
      localStorage.setItem(this.storage_key, JSON.stringify(cartData));

      return {
        success: true,
        message: 'Cart information updated successfully.',
      };
    } catch (error) {
      return { success: false, message: 'Error updating cart information.' };
    }
  }

  static async removeFromCart(productIdOrAll) {
    try {
      if (productIdOrAll === 'all') {
        await RESTapi.removeFromCart('all');
        localStorage.removeItem(this.storage_key);

        return { success: true, message: 'Cart removed successfully.' };
      } else {
        const cartData = JSON.parse(localStorage.getItem(this.storage_key));
        const productIndex = cartData.items.findIndex(
          (item) => item.productId === productIdOrAll
        );

        if (productIndex !== -1) {
          cartData.items.splice(productIndex, 1);
        } else {
          console.log(`Product ${productIdOrAll} not found in the cart.`);
          return {
            success: true,
            message: `Product ${productIdOrAll} not found in the cart.`,
          };
        }
        await RESTapi.removeFromCart(productIdOrAll);
        localStorage.setItem(this.storage_key, JSON.stringify(cartData));
        console.log(
          `Product ${productIdOrAll} removed from cart successfully.`
        );
        return {
          success: true,
          message: `Product ${productIdOrAll} removed from cart successfully.`,
        };
      }
    } catch (error) {
      // Handle the error if needed
      return { success: false, message: 'Error removing product from cart.' };
    }
  }

  static getCart() {
    return JSON.parse(localStorage.getItem(this.storage_key));
  }

  static getCountItemsInCart() {
    const cartData = JSON.parse(localStorage.getItem(this.storage_key));
    if (cartData) {
      const itemsLength = cartData.length;
      return itemsLength;
    } else {
      return 0;
    }
  }
}
