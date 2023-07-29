import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

// dotenv configuration
dotenv.config();

// create express app
const app = express();

// morgan setup
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Helmet configuration
app.use(helmet());

// parse json request body
app.use(express.json());

// parse json request url
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cookie parser
app.use(cookieParser());

// gzip compression
app.use(compression());

// file upload
app.use(fileUpload({ useTempFiles: true }));

// cors
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

// api v1 routes
app.use("/api/v1", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

// error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

export default app;
