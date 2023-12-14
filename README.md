## Ecomerce app back-end

This is the nest.js back-end part of the blog project.

### To start the project
- clone the project
- run `pnpm install` to install required dependencies
- create .env file
 - ##### Set up the env variables
   - DB_URL
   - JWT_SECRET
  - run `pnpm push` to load the postgresql
  - run `pnpm start:dev`
  - optionally run `pnpm studio` to access drizzle-kit studio

#### Apis
- `/auth/signup`
- `/auth/login` obtain pair of token
- `/auth/refresh` to get new pair of token wiht refresh token
- `/users/me` to get current user
- `/products` to add new products
