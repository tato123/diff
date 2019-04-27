import mongoose from "mongoose";

export const connect = () => {
  let options = { useNewUrlParser: true };
  const url = process.env.DOCUMENTDB_URL;

  if (
    process.env.NODE_ENV !== "stage" &&
    process.env.NODE_ENV !== "production"
  ) {
    // options = { useNewUrlParser: true };
  } else if (process.env.NODE_ENV === "stage") {
    throw new Error("MONGODB environment not configured yet");
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB environment not configured yet");
  }

  mongoose.connect(url, options, function(error) {
    if (error) {
      throw new Error(error.errmsg);
    }

    console.log("[Diff][Mongodb] Connected successfully to ", url);
  });
};
