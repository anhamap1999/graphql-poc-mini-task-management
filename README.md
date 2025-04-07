# graphql-poc-mini-task-management

## GraphQL Proof of Concept (PoC) – Learning Project
### Objective
This PoC aims to provide hands-on experience with GraphQL by building a simple API that demonstrates its core concepts, such as queries, mutations, resolvers, and subscriptions.

### Project Scope
- Build a GraphQL API using Node.js with Apollo Server.

- Define a Schema with types, queries, and mutations.

- Create Resolvers to fetch and modify data.

- Use a Database (e.g., SQLite, PostgreSQL, or MongoDB) for persistent data.

- Implement Authentication & Authorization (JWT-based).

- Integrate Subscriptions to handle real-time updates.

- Test the API using GraphQL Playground or Postman.

### Use Case: Simple Task Management API
A minimal task manager where users can:

- Sign up & log in (with authentication).

- Create, read, update, and delete tasks.

- Subscribe to real-time task updates.

### Tech Stack
- Backend: Node.js, Apollo Server

- Database: PostgreSQL (via TypeORM)

- Authentication: JSON Web Tokens (JWT)

- Pagination: Cursor-based

### Expected Outcome
By completing this PoC, you will understand:
- How GraphQL differs from REST.
- How to define GraphQL schemas and resolvers.
- How to handle queries, mutations, and subscriptions.
- How to integrate GraphQL with a database.
- How to implement authentication and authorization in a GraphQL API.

### Run project
- Copy the .env.sample file into .env and fill out the values.

- Open a terminal, run Postgres by running:
```
docker compose up
```

- Open another terminal, run the local GraphQL server by running:
```
yarn dev
```