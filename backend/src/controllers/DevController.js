const axios = require("axios");
const Dev = require(".././models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    let dev = await Dev.find();

    return res.json(dev);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      let { name, avatar_url, bio } = apiResponse.data;

      if (!name) {
        name = apiResponse.data.login;
      }

      if (!avatar_url) {
        avatar_url = "https://bit.ly/31GOHlX";
      }

      if (!bio) {
        bio = `lorem ipsum `;
      }

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      let dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }

    return res.json(dev);
  }
};
