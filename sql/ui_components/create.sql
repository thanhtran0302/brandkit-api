create table ui_components
(
  id varchar(50) CONSTRAINT componentkey PRIMARY KEY UNIQUE,
  project_id varchar(50) NOT NULL REFERENCES projects(id),
  name varchar(255) NOT NULL UNIQUE,
  description varchar(255) NOT NULL,
  creation_date timestamp NOT NULL,
  primary_style json NOT NULL,
  secondary_style json NOT NULL,
  third_style json NULL,
  forth_style json NULL,
  update_date timestamp NULL
)