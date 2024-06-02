This is a fully functioning EMR system. 

To run locally (given that a database has been created with the provided tables in sql_tables/):

In the app/ directory, create a .env file with the following fields: 
    DATABASE_USER = 
    ATABASE_HOST = 
    DATABASE_NAME = 
    DATABASE_PASSWORD =
    DATABASE_PORT =

    EXPRESS_SECRET =
    APP_SECRET =

npm install
cd app
node server