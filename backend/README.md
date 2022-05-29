# ClienteAPI
***
## _Backend_

API de un Pass Saver. Ofrece operaciones CRUD para los modelos Category y Site.

Para ejecutar la Base de Datos en Docker:
```
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=MyPassword-1234" -p 3012:1433 -d mcr.microsoft.com/mssql/server:2019-latest
```
Para que conecte a esta, habrá que indicar en la connection String el server "localhost,3012", ya que actualmente está apuntando al servidor deslpegado en Azure



Seguidamente, para crear los esquemas en la Base de Datos almacenados en la carpeta de Migrations (en local):
```
dotnet ef database update
```


Para iniciar la API:
```
dotnet run
```
La URL a la que habrá mandar las peticiones CRUD es: https://localhost:3022

Además, al lanzarse la API, se genera un Openapi 3 en la url https://localhost:3022/swagger/index.html

Por otro lado, indicar que se ha configurado la API para conectar con la base de datos desplegada en azure en este servidro: alanzserver.database.windows.net
