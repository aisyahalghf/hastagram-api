const db = require("../connection/conn");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = {
  createComment: async (req, res) => {
    try {
      const idUser = req.dataToken.id;
      const { id } = req.params;
      const { comment } = req.body;

      await query(
        `insert into comment_content (comment, content_id,users_id) value ("${comment}", ${id}, ${idUser});`
      );
      let getData = await query(`select * from comment;`);

      res.status(201).send({
        isSuccess: true,
        message: "comment sent",
        data: getData,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getAllComment: async (req, res) => {
    try {
      const { id_content } = req.query;
      let getData = await query(
        `select * from users_all_comment where id_content = ${id_content} order by create_at desc ;`
      );

      res.status(200).send({
        isSuccess: true,
        message: "get all data comment by id content success",
        data: getData,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};
