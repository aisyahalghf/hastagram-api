const db = require("../connection/conn");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const deleteFiles = require("../helper/deleteFile");

// import model
const fs = require("fs").promises;

module.exports = {
  userDetail: async (req, res) => {
    try {
      let id = req.dataToken.id;
      let profile_picture = req.files.images[0].path;
      let { fullname, bio } = req.query;

      let newFullname = fullname.replace(/%/g, " ");
      let newBio = bio.replace(/%/g, " ");

      await query(
        `insert into users_detail (fullname, bio, profile_picture, user_id) values ("${newFullname}", "${newBio}", "${profile_picture}", ${id})`
      );
      let data = await query(`select * from user_profiles where id = ${id};`);

      res.status(201).send({
        isSucees: true,
        message: "Thankyou for complite your profile ",
        data: data[0],
      });
    } catch (error) {
      console.log(error);
      if (req.files.images) deleteFiles(req.files.images);
      res.status(500).send({
        isSucees: false,
        message: error.message,
      });
    }
  },
  editPhotoProfile: async (req, res) => {
    try {
      const id = req.dataToken.id;

      profile_picture = req.files.images;
      const { bio, fullName, userName } = req.body;

      let data = await query(`select * from user_profiles where id = ${id}`);
      let idDetail = data[0].id_detail;

      if (profile_picture) {
        const photoToEdit = profile_picture[0].path;
        await query(
          `update users_detail set profile_picture = "${photoToEdit}"  where id = ${idDetail};`
        );
        let oldPathPhoto = data[0].profile_picture;
        await fs.unlink(oldPathPhoto);
      } else {
        let isExist = await query(
          `select * from users where username ="${userName}" except select * from users where id = ${id};`
        );
        if (isExist.length !== 0) throw { message: "username already taken" };
        await query(
          `update users_detail set fullname = "${fullName}", bio ="${bio}" where id = ${idDetail};`
        );
        await query(
          `update users set username = "${userName}" where id = ${id} `
        );
      }

      res.status(200).send({
        isSucees: true,
        message: "your photo profile is update",
      });
    } catch (error) {
      if (req.files.images) deleteFiles(req.files.images);
      res.status(500).send({
        isSucees: false,
        message: error.message,
      });
    }
  },
};
