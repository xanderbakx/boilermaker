const express = require('express');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({ db });
const port = process.env.PORT || 3000;
const passport = require('passport');
const User = require('./db/models/user');
const app = express();
module.exports = app;

// Development Secrets
if (process.env.NODE_ENV !== 'production') require('../secrets');

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    await User.findByPk(id);
  } catch (err) {
    done(err);
  }
});

const buildApp = () => {
  // Logging middleware
  app.use(morgan('dev'));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a big secret',
      store: dbStore,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // auth and api
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  // Static middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // 404 Error
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

// Listening on PORT
const listening = () => {
  const server = app.listen(port, () =>
    console.log(`🚢 🚢 Listening on port ${port} 🚢 🚢`)
  );
};
// Sync database
const syncDb = () => db.sync();

async function bootApp() {
  try {
    await dbStore.sync();
    await syncDb();
    await buildApp();
    await listening();
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  bootApp();
} else {
  buildApp();
}
