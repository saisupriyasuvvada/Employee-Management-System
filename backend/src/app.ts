import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import organizationRoutes from "./routes/organizationRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      // Allow requests without an Origin header,
      // such as API testing tools.
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },
    credentials: true,
  })
);

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Employee Management System API is running",
    });
});

export default app;