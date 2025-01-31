DROP DATABASE IF EXISTS test;
DROP TABLESPACE IF EXISTS tmpfs_space;

CREATE TABLESPACE tmpfs_space LOCATION '/var/lib/postgresql/tablespaces/tmpfs_tablespace';
CREATE DATABASE test TABLESPACE tmpfs_space;
GRANT ALL PRIVILEGES ON DATABASE test TO db_user;
