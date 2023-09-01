# Chef Botyardee

This repo is setup with three `package.json` files. One in the base (this directory), one in the `api` directory, and one in the `ui` directory. This is to allow for the API and client to be deployed separately.

This directory contains the linting and formatting configuration for the entire project.

## Base Setup

- [Install `nvm` to handle node versions](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Install `yarn` to handle node packages](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- `nvm use` to use the correct node version
- `yarn` to install dependencies


## API

### Setup

- Install Postgres v15
- Copy `.env.example` to `.env` and fill in the values
- Create `meal_recommender` database in Postgres:
```bash
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE meal_recommender;"
```

### Running the API

- `nvm use` to use the correct node version
- `yarn` to install dependencies
- `yarn dev` to start the API


## UI

### Setup

- Copy `.env.example` to `.env` and fill in the values

### Running the UI

- `yarn start` to start the UI