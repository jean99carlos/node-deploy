// import { PrismaClient } from "@prisma/client";
// import {z} from 'zod'import "reflect-metadata";
import fastify from "fastify";
import { IOC } from "./infrastructure/crosscutting/ioc/ioc";

export default () => {
  const app = fastify();
  IOC.execute(app);
  // app.get("/users", async () => {
  //   const users = await prisma.user.findMany();
  //   return {users};
  // });

  // app.post("/users",async (request,reply) => {
  //     const createUserSchema = z.object({
  //         name:z.string(),
  //         email:z.string().email()
  //     })
  //     const {name,email} = createUserSchema.parse(request.body);

  //     await prisma.user.create({
  //         data:{
  //             name,
  //             email
  //         }
  //     })
  //     return reply.status(201).send();
  // });
  app
    .listen({
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 3333,
    })
    .then(() => {
      console.log(
        "HTTP Server Running on port " +
          (process.env.PORT ? Number(process.env.PORT) : 3333).toString()
      );
    });
};
