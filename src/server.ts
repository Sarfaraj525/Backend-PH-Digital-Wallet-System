/* eslint-disable no-console */
import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
// import { seedSuperAdmin } from "./app/modules/utils/seedSuperAdmin";
// import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      envVars.DB_URL,
    );

    console.log("Connected to MongoDB");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

(async () => {
    await startServer()
    await seedSuperAdmin()
})()

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection... Server shutting down:", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception... Server shutting down:", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on("SIGTERM", () => {
  console.error("SigTerm signal received... Server shutting down:");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// unhandledRejection

// Promise.reject(new Error("I forgot to catch this promise"));

// uncaughtException

// throw new Error("I forgot to catch this local error");

// signal Termination
