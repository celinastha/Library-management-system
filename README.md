1- have Node.js v22.17.0. and mysql.exe  Ver 8.0.44 installed and set up on envrionment variable path.
2- create a sql server in sql install version 8.0.44
3- create three terminals in the library-management-system
4- "cd database" in the first terminal
5- "mysql -u root -p"
6- for ever sql file in database, "source [filename].sql;"
7- in the 2nd terminal, "cd backend"
8- make .env and firebaseServiceAccountKey.json based on the provided example version (u need to set up a firebase for firebaseServiceAccountKey json)
9- "npm i" and "npm start"
10- for the 3rd terminal, "cd frontend"
11- make .env based on the provided example version (u need to set up a firebase for .env)
12- "npm i" and "npm run dev"