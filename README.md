# OrderTransactionAPI

## Installation
1. Clone source code
```
git clone https://github.com/christangga/OrderTransactionAPI.git
```

2. Install dependencies
```
npm install
```

3. Configure environment
Copy and rename `.env.example` into `.env` and set the configs.

4. Start application
```
npm start
```

## Docs

### Customer Endpoint
1. `GET /cart` - Get customer cart. Cart is implemented using session and reset every 1 hour. After customer order the product, session is reset.

2. `POST /cart` - Add product to cart. Product quantity can be negative. If product exist in cart, quantity is summed.
Available `product_id` for now: 
  - 57dbaeaadcba0f0cb705101c
  - 57dd542df36d281f21d619ad
  Example Request Data:
  ```
  {
    "product_id": "57dd542df36d281f21d619ad",
    "product_quantity": 10
  }
  ```

3. `GET /cart/coupon` - Add coupon to cart. Coupon is replaced if exist in the cart.
  Available `coupon_code` for now:
  - DC10K
  - DC20K
  - DC10P
  Example Request Data:
  ```
  {
  	"coupon_code": "DC10K"
  }
  ```

4. `POST /order` - Order products. Customer must fill name, email, address, and phone number. Customer must save `order_id` given by the response.
Example Request Data:
```
{
	"name": "Christ",
	"email": "ca@gmail.com",
	"phone": "08123456789",
	"address": "Bandung"
}
```

5. `POST /order/pay` - Pay order. Customer must attach payment proof to be verified later by admin. Order status automatically changed into `paid`.
Example Request Data:
```
proof=path/to/file
order_id=57dcc0cff2539b1874e085a9
```

6. `GET /order/:order_id` - Check order status.

7. `GET /shipping/:shipping_id` - Check shipping status.

### Admin Endpoint
For now, login system for admin has not been implemented yet. Authentication system can be implemented using token based system (access token, refresh token).

1. `GET /admin/order` - Retrieve all customers' orders.
Can be filtered using `status`.
Available status:
  - pending - order has been created but not yet paid by customers
  - paid - order has been paid and waiting to be verified.
  - verified - order has been verified by admin and ready to be shipped.
  - cancelled - order has been cancelled by admin.
  - shipped - order has been shipped by admin.

2. `GET /admin/order/:order_id` - Get order detail.

3. `POST /admin/order/update` - Update order from `pending`/`paid` to `verified`/`cancelled`.
Available scenario:
  - verify - verify order
  - cancel - cancel order

Example Request Data:
```
{
	"scenario": "verify",
	"order_id": "57dcc0cff2539b1874e085a9"
}
```

4. `POST /admin/order/ship` - Ship order. Change order status from verified to shipped and create shipping_id (tracking) number.

Example Request Data:
```
{
	"order_id": "57dcc0cff2539b1874e085a9",
	"shipping_id": "1234567890"
}
```

## Testing
For now, there are 50+ unit tests has been implemented. To test, issue this command:
```
npm test
```

