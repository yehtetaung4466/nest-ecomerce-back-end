## Ecomerce app back-end

This is the nest.js back-end part of the blog project.

### To start the project
- clone the project
- run `pnpm install` to install required dependencies
- create .env file
 - ##### Set up the env variables
   - DB_URL
   - JWT_REFRESH_TOKEN_SECRET
   - JWT_ACCESS_TOKEN_SECRET
  - run `pnpm push` to load the postgresql
  - run `pnpm start:dev`
  - optionally run `pnpm studio` to access drizzle-kit studio

#### Apis
- post `/auth/signup`
- post `/auth/login` obtain pair of token
- post `/auth/refresh` to get new pair of token wiht refresh token
- get `/users/me` to get current user
- get,post,del `/products` to add new products or get/del all products
- get,del `/products/{productId}` to get/del specific product
- get `/products/images/{productId}` to see product image
