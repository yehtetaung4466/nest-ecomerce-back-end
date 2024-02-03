## Ecomerce app back-end

This is the nest.js back-end part of an e-comerece project.

### To start the project
- clone the project
- run `pnpm install` to install required dependencies
- create .env file
 - ##### Set up the env variables
   - DB_URL
   - JWT_REFRESH_TOKEN_SECRET
   - JWT_ACCESS_TOKEN_SECRET
  - run `pnpm db:prepare` to prepare the postgresql
  - run `pnpm start:dev`
  - optionally run `pnpm studio` to access drizzle-kit studio

#### Apis
- post `/auth/signup`
- post `/auth/login` obtain pair of token
- post `/auth/refresh` to get a new pair of token wiht refresh token
- get `/users/me` to get current user
- get,post,del `/products` to add new products or get/del all products
- get,del `/products/{productId}` to get/del specific product
- get `/products/images/{productId}` to see product image
- patch `/products/{productId}/stock` to change stock 
- patch `/products/{productId}/price` to change price 
- post `/orders` to make orders
- get `/orders/:orderId` to get specific order 
- get `/users/me/orders` to get current user's orders
- get `/users/:userId/orders` to get specific user's orders
- post `/ratings` to make new rating
- pust `/ratings/:ratingId` to update rating
