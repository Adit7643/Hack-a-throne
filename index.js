import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import multer from 'multer';
import path from 'path';
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const app = express();
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/event-images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
  res.render("home.ejs");
});
app.get("/events", (req, res) => {
  res.render("events.ejs");
});
app.get("/eventhost", (req, res) => {
  res.render("eventhost.ejs");
});
app.get("/login", (req, res) => {
  res.render("home.ejs");
});

app.post('/uploadevent', upload.single("image_source"), async (req, res) => {
  const destination = req.file.destination.replace("public/", "");
  const source = destination + "/" + req.file.filename;
  console.log(source);
  req.session.source = source;
  console.log(req.session.source);
  res.render("eventhost.ejs",
    {
      imageSrc:source,
    }
  )
});

app.post('/eventdetail', async (req, res) => {
  try {
    const table = req.body.Location;

    await db.query(
      `INSERT INTO ${table} (eventname, eventdes, eventdatetime, price, image) VALUES ($1, $2, $3, $4, $5)`,
      [req.body.eventName, req.body.eventdes, req.body.eventdate, req.body.eventprice, req.session.source]
    );

    const events = await db.query(`SELECT * FROM ${table}`);

    const eventNames = events.rows.map(event => event.eventname);
    const descriptions = events.rows.map(event => event.eventdes);
    const dates = events.rows.map(event => event.eventdatetime);
    const prices = events.rows.map(event => event.price);
    const images = events.rows.map(event => event.image);

    res.render("events.ejs", {
      EventNames: eventNames,
      Descriptions: descriptions,
      Dates: dates,
      Prices: prices,
      Images: images,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server Error");
  }
});





app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/lander", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("maharastra.ejs");
  } else {
    res.redirect("maharastra.ejs");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/lander",
  passport.authenticate("google", {
    successRedirect: "/lander",
    failureRedirect: "/login",
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/lander",
    failureRedirect: "/login",
  })
);

app.post("/signup", async (req, res) => {
  const email = req.body.mail;
  const password = req.body.Password;
  const location = req.body.Location;
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  req.session.email = req.body.mail;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password,location, firstname,lastname) VALUES ($1, $2,$3,$4,$5) RETURNING *",
            [email, hash, location, firstname, lastname]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/lander");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  "local",
  new Strategy(async function verify(email, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://hack-a-throne-4.onrender.com/auth/google/lander",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          req.session.mail = profile.email;
          const newUser = await db.query(
            "INSERT INTO users (email,Location,firstname,lastname, password,image) VALUES ($1, $2,$3,$4,$5,$6)",
            [profile.email, "maharastra", profile.given_name, profile.family_name, "google123", profile.picture]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port`);
});
