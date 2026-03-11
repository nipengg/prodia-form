Jika ingin pull image langsung dari docker:

- Copy aja file `docker-compose-pull-example.yml` ke local
- Masuk director docker compose yml terus run: `docker-compose pull && docker-compose up -d`
- Masuk ke API di Docker Desktop terus run: `npx sequelize-cli db:seed:undo && npx sequelize-cli db:seed:all`