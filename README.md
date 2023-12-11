## Ecomerce app back-end

This is the nest.js back-end part of the blog project.

### To start the project
- clone the project
- run `pnpm install` to install required dependencies
- create .env file
 - ##### Set up the env variables
   - DB_URL
   - JWT_SECRET
  - run `pnpm push` to load the mysql
  - run `pnpm start:dev`

#### Apis
- `/auth/signup`
- `/auth/login` obtain pair of token
- `/auth/refresh` to get new pair of token wiht refresh token
- `/users/me` to get current user
