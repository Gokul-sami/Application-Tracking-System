import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://application-tracking-system-wiyl.vercel.app/",
  "https://hybrid-application-tracking-system-six.vercel.app",
  "https://hybrid-application-tracking-git-bdbf87-gokuls-projects-36b9795c.vercel.app",
  "https://hybrid-application-tracking-system-6-q726q5ipt.vercel.app",
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
