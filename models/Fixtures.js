import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema(
  {
    league: String,     // epl, laLiga , ligue1.
    date: String,
    home: String,
    away: String,
    time: String,
  },
  {
    timestamps: true,
    collection: "epl_fixtures", // Explicitly save to this collection
  }
);

const Fixture = mongoose.model("Fixture", fixtureSchema);

export default Fixture;
