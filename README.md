# init node  
npm init -y

# install dependencies
npm install -D typescript @types/node tsx tsup
npx tsc --init
npm i fastify
npm i prisma -D
npm i @prisma/client
npx prisma init
npm i zod

# initialize docker container for postgres
docker ps
docker pull postgres 
docker images
docker run --name pg -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
//create users

# prisma studio 
npx prisma studio 

# run server on dev for testing
npm run dev
curl  localhost:3333/users

# initialize git repo
git init
git add .
git commit -m "Initial commit"
git push

# deploy
render.com

# reference
https://www.youtube.com/watch?v=pmXfvd6Zqg4