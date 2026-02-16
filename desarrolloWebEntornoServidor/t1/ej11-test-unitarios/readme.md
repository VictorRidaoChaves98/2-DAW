## Se piden:

### Ejercicios a entregar: 2, 3, 4 y 5 

Cobertura de test 100%
Scripts: test, test:watch, test:coverage, test:report

añadir al .gitignore las carpetas generadas por los test (global del repositorio)
Añadir ficheros de Sonar: sonar-scanner.properties + docker-compose.yml

### Ejercicios básicos

2. **FizzBuzz con tests**
   - Implementar el ejercicio FizzBuzz con **tests completos** usando el framework que prefieras (Vitest, Jest o AVA).
   - Requisitos:
     - Programa funcionando correctamente.
     - Tests con **cobertura de código 100%**.
     - Configuración de **ESLint** y **Prettier**.

3. **Comparación de fechas**
   - Crear una función `dateCompare` que:
     - Reciba **dos fechas** y devuelva cuál es anterior y cuál posterior:
       ```js
       { startDate: 'ISODateString', endDate: 'ISODateString' }
       ```
     - Si solo recibe una fecha, la compare con el momento actual.
     - Contar con **tests completos** con diferentes casos de uso.
     - Usar librería **Luxon** o nativa `Date`.

4. **FizzBuzz flexible**
   - Modificar FizzBuzz para recibir **condiciones dinámicas**:
     ```js
     const n = 100;
     const conditions = { 2: 'poo', 3: 'fizz', 5: 'buzz', 7: 'bar' };
     // Debe devolver combinaciones: 'poofizz' para 6, 'fizzbuzz' para 15, etc.
     
### Ejercicios avanzados

5. **Testing con mocks**
   - Crear una función que consulte una **API externa** (axios o fetch).
   - Escribir **tests usando mocks** para simular las respuestas.
