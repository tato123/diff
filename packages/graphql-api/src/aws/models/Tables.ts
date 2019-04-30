const randomId = Math.floor(Math.random() * 10000);

export default {
  Delta: process.env.NODE_ENV === "development" ? `Delta-dev` : "Delta",
  Project: process.env.NODE_ENV === "development" ? `Project-dev` : "Project",
  User: process.env.NODE_ENV === "development" ? `User-dev` : "User"
};
