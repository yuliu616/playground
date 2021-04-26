GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.people TO 'hellouser'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.family TO 'hellouser'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.family_child TO 'hellouser'@'%';

FLUSH PRIVILEGES;
