import "dotenv/config";
import dns from "node:dns";
import app from "./app";
import connectDB from "./config/db";



dns.setServers(["8.8.8.8", "8.8.4.4"])

const PORT = process.env.PORT || 5000;

const startServer =
  async (): Promise<void> => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(
          `Server is running on port ${PORT}`
        );
      });
    } catch (error) {
      console.error(
        "Failed to start server:",
        error
      );

      process.exit(1);
    }
};


startServer();





