CREATE TABLE moderate (
  id BIGSERIAL NOT NULL,
  moderator_name varchar(255) not null,
  action varchar(255) not null,
  last_message text not null,
  moderate_target text not null,
  timestamp timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
