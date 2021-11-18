GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.ppl_people TO 'hellouser'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.ppl_family TO 'hellouser'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER
  ON hellodb.ppl_family_child TO 'hellouser'@'%';

FLUSH PRIVILEGES;
