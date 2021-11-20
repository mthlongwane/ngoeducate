# NGO App Generator

### Set up linux-container using setup script 
Run setup.sh for standard ubuntu machine

```
chmod +x setup.sh
./setup.sh
```

### Setup Expo account
Create an account on [Expo](https://expo.dev). You'll use the username/password of this account in the next step.
### Set server environment variables
Copy `server/.env.dist` to `server/.env` and set the database variables and Expo credentials in the *.env* file.
If you want to use the docker version of postgres set `DB_HOST=db`, `DB_PORT=5432`, and `DB_NAME` to any valid database name. For development environment set it to `DB_NAME=ngo` 
Note for the EXPO_PASSWORD environment variable, use two sets of single-quotation marks. i.e:  EXPO_PASSWORD = ''PasswordValue'' 

Enter the public host name for `BASE_URL`. For development environment you can use `http://localhost:4000`. This address will be used for loading the media files from the generated apps.

### Set frontend environment variables
Copy `frontend/.env.dist` to `frontend/.env` and set the `REACT_APP_BASE_URL`. This value should be the same as the `BASE_URL` value you set in the previous step

### Run the backend and frontend
Run:
```
docker-compose up -d
```
Wait for the services to build and start.
