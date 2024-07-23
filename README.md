# UT-CADDE consumer webapp

## Setup

### Verified Environment
`docker version 25.0.3`

### Set Environment Variables
Prepare your client ID and client secret.
Then, 
```bash
cp .env .env.local
echo CLIENT_ID="<your client id>" >> .env.local
echo CLEINT_SECRET="<your client secret>" >> .env.local
```

### Build and run the application

```bash
docker compose up -d --build
```
You can access the application though http://(your hostname):3000

ex) http://cadde-webapp-test2.koshizukalab.dataspace.internal:3000

## How to use the applicaiton
1. Prepare your CADDE ID and password.
1. Access the application URL and enter your account information.
1. Visit the "Settings" page and enter your consumer connector URL
    > The URL must begin with "https".
1. Press the "Confirm" button. Then, you can search for or download files in the Dataspace.

## For developers
You can deploy the application in development mode by edting the follwing section of `docker-compose.yml`
```yml
command: sh -c "npm run build && npm run start"
# command: sh -c "npm run dev"
```