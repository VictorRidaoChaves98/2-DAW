// src/server.ts
import { ODataServer, ODataController, Edm } from "odata-v4-server";

class User {
  @Edm.Key
  @Edm.Int32
  id!: number;

  @Edm.String
  name!: string;

  @Edm.String
  email!: string;
}

class UsersController extends ODataController {
  // Método find se expone automáticamente como GET /Users
  public async find(): Promise<User[]> {
    return [
      { id: 1, name: "Victor", email: "victor@example.com" },
      { id: 2, name: "Manzano", email: "manzano@example.com" },
    ];
  }
}

class UsersODataServer extends ODataServer {
  public users = UsersController;
}

// Arrancamos el servidor OData en el puerto 5000
UsersODataServer.create("/odata", 5000);
console.log("Servidor OData en http://localhost:5000/odata");
