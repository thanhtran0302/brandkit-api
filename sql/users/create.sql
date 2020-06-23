create table users(
  id                varchar(50) CONSTRAINT userkey PRIMARY KEY UNIQUE,
  email             varchar(255) NOT NULL UNIQUE,
  password          varchar(255) NOT NULL,
  is_activated      boolean NOT NULL,
  creation_date     timestamp NOT NULL,
  activation_token  varchar(50) NOT NULL,
  plan              varchar(255) NOT NULL,
  firstname         varchar(100) NULL,
  lastname          varchar(100) NULL,
  reset_pwd_token   varchar(50) NULL
);