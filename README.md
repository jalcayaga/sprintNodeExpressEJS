# Developers
* Nicolas
* Javier Alcayaga
# Installation

```shell
git clone https://github.com/jalcayaga/sprintNodeExpressEJS.git
npm install
npm run dev
npm start
```

# Environment Variables

- `PORT`, this is the http port of the server. by default is `5000`.
- `APPID` - (optional), this is an unique ID for the application to identify in a load balancer

Also you can create a .env file with the environment variables mentioned above.

# Considerations

- Make sure nodemon ignores the file `src/resultados.json`.

