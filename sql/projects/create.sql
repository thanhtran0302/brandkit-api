create table projects (
  id              varchar(50) CONSTRAINT projectskey PRIMARY KEY UNIQUE,
  user_id         varchar(50) NOT NULL REFERENCES users(id),
  name            varchar(255) NOT NULL UNIQUE,
  description     varchar(255) NOT NULL,
  creation_date   timestamp NOT NULL
);
