import RESTapi from './RESTapi';

export default class CartStorage {
  static storage_key = 'USER_CART';

  static async setCartStorage() {
    try {
      const response = await RESTapi.fetchCartData();

      if (response.getCart && response.data.items !== undefined) {
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
          validator: { isStock: false, isAllOptionSelected: false },
          note: '',
        };

        const updatedList = listOfObjects.map((obj) => {
          const newItem = { ...newFormat.property }; // Create a copy of the newFormat.item object

          // Copy the properties from the original object to the newItem
          newItem.product_name = obj.product_name;
          newItem.product_photo = obj.product_photo[0];
          newItem.product_url_name = obj.product_url_name;
          newItem.option = obj.option
            ? { isSelect: false, choice: obj.option }
            : {}; // Use an empty object if option is null
          newItem.product_price = obj.product_price;

          return {
            product_id: obj._id,
            property: newItem,
            validator: { ...newFormat.validator },
            note: '',
          };
        });
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
    let newCartData;
    if (!oldCartData || oldCartData === null || oldCartData === undefined) {
      newCartData = [productData];
    } else {
      newCartData = [...oldCartData, productData];
    }

    try {
      const response = await RESTapi.addToCart({
        product_id: productData.product_id,
      });
      localStorage.setItem(this.storage_key, JSON.stringify(newCartData));
      return response;
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

  static async removeFromCart(props) {
    console.log(props);
    try {
      if (props.all) {
        await RESTapi.removeFromCart({ product_id: 'all' });
        localStorage.removeItem(this.storage_key);

        return { success: true, message: 'Cart removed successfully.' };
      } else {
        const cartData = JSON.parse(localStorage.getItem(this.storage_key));

        console.log(cartData[props.index]);
        if (props.index >= 0 && props.index < cartData.length) {
          cartData.splice(props.index, 1);
        } else {
          console.log('Invalid index. Element cannot be removed.');
        }
        localStorage.setItem(this.storage_key, JSON.stringify(cartData));
        if (!cartData.some((item) => item.product_id === props.product_id)) {
          await RESTapi.removeFromCart({ product_id: props.product_id });
        }

        console.log(
          `Product ${props.product_id} removed from cart successfully.`
        );
        return {
          success: true,
          message: `Product ${props.product_id} removed from cart successfully.`,
        };
      }
    } catch (error) {
      console.error(error);
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
