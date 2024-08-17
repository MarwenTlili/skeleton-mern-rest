const devDatabase = "skeleton";
const testDatabase = "skeleton_test";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

function colorize(message, color) {
  return color + message + colors.reset;
}

const devUser = {
  user: "dev",
  pwd: "dev",
  roles: [
    {
      role: "readWrite",
      db: devDatabase
    }
  ]
};

const testUser = {
  user: "test",
  pwd: "test",
  roles: [
    {
      role: "readWrite",
      db: testDatabase
    }
  ]
}

function createDatabaseAndUser(database, user) {
  const siblingDB = db.getSiblingDB(database);

  // Check if the user already exists
  if (siblingDB.getUser(user.user)) {
    print(colorize(`User ${user.user} already exists in ${database} database.`, colors.yellow));
    return;
  }

  siblingDB.createUser(user);
  print(colorize(`Created user ${user.user} in ${database} database.`, colors.green));

  siblingDB.createCollection("initial_collection");
  print(colorize(`Created initial_collection in ${database} database.`, colors.green));
}

try {
  createDatabaseAndUser(devDatabase, devUser);
  createDatabaseAndUser(testDatabase, testUser);
} catch (e) {
  print(colorize(e, colors.red));
}
