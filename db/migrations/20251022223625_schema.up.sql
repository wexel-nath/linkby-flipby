CREATE USER flipby_server WITH LOGIN PASSWORD 'password';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "user" (
    id            UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TYPE PRODUCT_STATUS AS ENUM(
    'Available',
    'Reserved',
    'Sold'
);

CREATE TABLE product (
    id             UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id        UUID NOT NULL REFERENCES "user" (id),
    name           TEXT NOT NULL,
    price_amount   INTEGER NOT NULL,
    price_currency TEXT NOT NULL,
    description    TEXT NOT NULL,
    images         TEXT[] NOT NULL,
    status         PRODUCT_STATUS NOT NULL
);

CREATE TYPE OFFER_BY AS ENUM(
    'Buyer',
    'Seller'
);

CREATE TABLE offer (
    id            UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    product_id    UUID NOT NULL REFERENCES "product" (id),
    user_id       UUID NOT NULL REFERENCES "user" (id),
    offer_by      OFFER_BY NOT NULL,
    price_amount  INTEGER NOT NULL,
    accepted_at   TIMESTAMP WITH TIME ZONE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "user" TO flipby_server;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE product TO flipby_server;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE offer TO flipby_server;
