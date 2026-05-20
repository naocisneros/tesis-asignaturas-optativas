# Instalacion del backend de la aplicaciòn:
1-Seguir las variables de entorno que se encuentran en el .env.example sobre todo la BASE_URL que indicarà la url donde correrà el server
2-Nombrar las siguientes variables de entorno:
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=configurations_ms
donde estarà alojada la base de datos local de la app
3-Abrir una consola en Webstorm o un editor de còdigo como VS Code y mover con cd a la carpeta subject_backend
4-Instalar las dependencias del backend de la app con npm install
5-Levantar la app con npm run start:dev
6-Debe crearse un usuario usando un cliente como Postman o Thunder Client para hacer la peticiòn a la API en el endpoint users/register

# Instalacion del frontend de la aplicaciòn:
1-Abrir terminal
2-Mover hacia el folder optional_subject_frontend
3-Instalar dependencias con npm install
4-Levantar la app con npm run dev