import app from "./app.js";
import { connectDB, shutDownDB } from "./src/config/db.js";
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
      await shutDownDB();
      server.close(() => {
        console.log("Server Closed");
        process.exit(0);
      });
    });
    process.on("SIGTERM", async () => {
      await shutDownDB();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
  }
};

startServer();
