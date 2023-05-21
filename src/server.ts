import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { IOC } from "./infrastructure/crosscutting/ioc/ioc";

export default () => {
  const app = fastify({
    logger: true,
    connectionTimeout: 5000
  });

  app.addHook(
    "onSend",
    async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
      if (
        payload instanceof Error &&
        payload.constructor.name === "DomainError"
      ) {
        app.log.error(payload);
        console.error("ERROR HANDLER CALLED");
        console.error("Unhandled Rejection:", payload);
        reply.code(500).send({ error: "Internal Server Error" });
        return false; // Stop further processing
      }
      return payload;
    }
  );

  // process.on("uncaughtException", (error) => {
  //   //console.error("Uncaught Exception:", error);
  //   process.exit(1);
  // });

  // process.on("unhandledRejection", (reason, promise) => {
  //   //console.error("Unhandled Rejection:", reason);
  // });

  IOC.execute(app);

  app.listen(
    {
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 3333,
    },
    function (err, address) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      // Server is now listening on ${address}
    }
  );

  console.log(
    "HTTP Server Running on port " +
      (process.env.PORT ? Number(process.env.PORT) : 3333).toString()
  );
};
