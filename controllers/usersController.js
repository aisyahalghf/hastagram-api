const db = require("../connection/conn");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;

// import hashing
const { hashMatch, hashPassword } = require("./../lib/hash");

// import JWT
const { createToken } = require("./../lib/jwt");

module.exports = {
  createUsers: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const regexPass =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

      let isEmailExists = await query(
        `select EXISTS (select * from users where email ="${email}" ) As found_email;`
      );
      let isUsernameExists = await query(
        `select EXISTS (select * from users where  username = "${username}") As found_username ;`
      );

      let { found_email } = isEmailExists[0];
      let { found_username } = isUsernameExists[0];

      if (found_email === 1) throw { message: "email telah terdaftar" };
      if (found_username === 1) throw { message: "username telah terdaftar" };
      if (!email.match(/\S+@\S+\.\S+/)) throw { message: "not a valid email" };
      if (!password.match(regexPass))
        throw {
          message:
            "weak password, password must contain at least 8 character including uppercase, lowercase, asyimbol and number",
        };

      let createAccount = await query(
        `insert into users (username, email, password) values ("${username}", "${email}", "${await hashPassword(
          password
        )}")`
      );

      let token = createToken({ id: createAccount.insertId });

      //mengirim email verifikasi
      let template = await fs.readFile("./template/email.html", "utf-8");
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        name: username,
        token: token,
      });

      let mail = {
        from: `Admin <alghifariaisyahputri@gmail.com>`,
        to: `${email}`,
        subject: `verified email`,
        html: newTemplate,
      };
      transporter.sendMail(mail, (err, resMail) => {
        res.status(201).send({
          isSuccess: true,
          message: "Register Success, check your email",
        });
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  verification: async (req, res) => {
    try {
      let id = req.dataToken.id;
      await query(`update users set status="verified" where id = ${id}`);
      let data = await query(`select username from users where id = ${id}`);
      res.status(200).send({
        isSuccess: true,
        message: "your account is verified",
        data: data[0],
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body;

      let isExist = await query(
        `select * from users where  username = "${emailOrUsername}" or email="${emailOrUsername}";`
      );
      console.log(isExist);

      if (isExist.length === 0)
        throw { message: "username or email not found" };

      let matchPassword = await hashMatch(password, isExist[0].password);
      if (matchPassword === false) throw { message: "your password incorrect" };

      token = createToken({ id: isExist[0].id });
      let data = await query(
        `select * from user_profiles where id = ${isExist[0].id};`
      );
      console.log(data);

      res.status(200).send({
        isSuccess: true,
        message: "success login",
        token: token,
        data: data[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      let id = req.dataToken.id;
      let data = await query(`select * from user_profiles where id = ${id};`);
      res.status(200).send({
        isSuccess: true,
        message: "getUserSuccessfully",
        data: data[0],
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  resendVerification: async (req, res) => {
    try {
      let id = req.dataToken.id;
      let data = await query(`select * from users where id =${id}`);
      let username = data[0].username;
      let email = data[0].email;

      let token = createToken({ id: id });

      let template = await fs.readFile("./template/email.html", "utf-8");
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        name: username,
        token: token,
      });

      let mail = {
        from: `Admin <alghifariaisyahputri@gmail.com>`,
        to: `${email}`,
        subject: `verified email`,
        html: newTemplate,
      };
      transporter.sendMail(mail, (err, resMail) => {
        res.status(201).send({
          isSuccess: true,
          message: "resend verification succes, please check your email",
        });
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};
