const db = require("../connection/conn");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const deleteFiles = require("../helper/deleteFile");

// import model
const fs = require("fs").promises;

module.exports = {
  contenUpload: async (req, res) => {
    try {
      let idUsers = req.dataToken.id;
      let images = req.files.images[0].path;
      let { caption } = req.query;

      await query(
        `insert into content (images, caption,users_id) values ("${images}", "${caption}", ${idUsers});`
      );
      let getData = await query(
        `select * from images_posted where id = ${idUsers} ;`
      );

      res.status(201).send({
        isSuccess: true,
        message: "upload photo success",
        data: getData,
      });
    } catch (error) {
      console.log(error);
      if (req.files.images) deleteFiles(req.files.images);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  contentEdit: async (req, res) => {
    try {
      let { id } = req.params;

      let dataToSend = [];
      for (let props in req.body) {
        dataToSend.push(`${props} = "${req.body[props]}" `);
      }

      let data = await query(
        `update content set ${[...dataToSend]} where id = ${id};`
      );
      console.log(data);

      res.status(200).send({
        isSuccess: true,
        message: "update success",
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      let idUsers = req.dataToken.id;
      let getData = await query(
        `select * from content where users_id = ${idUsers} order by create_at desc ;`
      );

      res.status(200).send({
        isSuccess: true,
        message: "get all data success",
        data: getData,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  removeContent: async (req, res) => {
    try {
      const { id } = req.params;
      let data = await query(`select * from content where id = ${id}`);
      let removePathImage = data[0].images;

      await query(`delete from content where id = ${id};`);
      await fs.unlink(removePathImage);

      res.status(200).send({
        isSuccess: true,
        message: "your photo has been delete",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  allUserContent: async (req, res) => {
    try {
      let getData = await query(
        `select * from  content_user order by create_at desc;`
      );

      res.status(200).send({
        isSuccess: true,
        message: "get all content success",
        data: getData,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getUserContentParam: async (req, res) => {
    try {
      let { id } = req.params;
      let getData = await query(
        `select * from content_user where id = ${id} ;`
      );
      res.status(200).send({
        isSuccess: true,
        message: "get content and user params success",
        data: getData[0],
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};
