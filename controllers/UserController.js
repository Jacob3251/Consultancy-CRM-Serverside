import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { userSchma } from "../validation/UserValidation.js";
import {
  generateToken,
  hasher,
  passMatched,
  removeFile,
} from "../utils/helper.js";
import bcrypt from "bcrypt";
// registering the user
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw Error;
    }
    const validator = vine.compile(userSchma);
    const payload = await validator.validate(req.body);
    payload.password = await hasher(payload.password);
    console.log(payload);
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      throw Error;
    }
    const totalUser = await prisma.user.count();
    console.log("totalUser", totalUser);
    if (totalUser < 1) {
      payload.role = "Super-Admin";
      payload.verified = true;
    } else {
      payload.role = "Officer";
      payload.verified = false;
    }

    const newUser = await prisma.user.create({
      data: payload,
    });

    if (newUser) {
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        storage_link: newUser.storage_link,
        // role: userExists.role,
        // verified: userExists.verified,
        // contact_no: userExists.contact_no,
      };
      res.json({
        status: 200,
        data: userData,
        token: generateToken(newUser),
        message: "User Created",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Email Already Taken . Please add another email",
      error: error.message,
    });
  }
};

// loggin the user
export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    const userData = {
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      storage_link: userExists.storage_link,
      // role: userExists.role,
      // verified: userExists.verified,
      // contact_no: userExists.contact_no,
    };
    res.status(200).json({
      email: userExists.email,
      data: userData,
      token: generateToken(userExists),
    });
  }
};

export const fetchUsers = async (req, res) => {
  const data = await prisma.user.findMany({});
  if (data) {
    res.json({
      status: 200,
      data: data,
      message: "Data Received",
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (userExists) {
      const userRoleData = await prisma.role.findFirst({
        where: {
          title: userExists.role,
        },
      });
      if (userRoleData) {
        const userPermissions = userRoleData.permissions;
        res.status(200).json({
          status: 200,
          data: { ...userExists, permissions: userPermissions },
          // message: "Data Received",
        });
      }
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(400).json({
      message: "Couldn't get user information!!",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const body = req.body;
    console.log(body);

    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExists) {
      throw Error;
    }

    const file = req.file;

    const validator = vine.compile(userSchma);
    if (!file) {
      let updatedPass;
      if (body.old_password && body.new_password) {
        const temp = await passMatched(body.old_password, userExists.password);
        if (temp) {
          updatedPass = await hasher(body.new_password);
        } else {
          return res.status(400).json({
            message: "You've entered incorrect old password",
          });
        }
      } else {
        updatedPass = userExists.password;
      }
      const updatedData = {
        ...body,
        name: body.user_name ? body.user_name : userExists.name,
        email: userExists.email,
        password: updatedPass,
        contact_no: body.contact_no ? body.contact_no : userExists.contact_no,
      };

      const payload = await validator.validate(updatedData);
      await prisma.user
        .update({
          data: payload,
          where: {
            id: userId,
          },
        })
        .then((data) => {
          const userData = {
            id: data.id,
            name: data.name,
            email: data.email,
            storage_link: data.storage_link,
            // role: data.role,
            // verified: data.verified,
            // contact_no: data.contact_no,
          };
          return res.status(200).json({
            email: data.email,
            data: userData,
            token: generateToken(data),
          });
        })
        .catch((error) => {
          throw Error;
        });
    }
    if (file) {
      if (userExists.storage_link === "") {
        let updatedPass;
        if (body.old_password && body.new_password) {
          const temp = passMatched(old_password, userExists.password);
          if (temp) {
            updatedPass = body.new_password;
          } else {
            return res.status(400).json({
              message: "You've entered incorrect old password",
            });
          }
        } else {
          updatedPass = userExists.password;
        }
        const updatedData = {
          name: body.user_name ? body.user_name : userExists.name,
          email: userExists.email,
          password: updatedPass,
          contact_no: body.contact_no ? body.contact_no : userExists.contact_no,
          role: body.role ? body.role : userExists.role,
          verified: body.verified ? body.verified : userExists.verified,
        };
        const payload = validator.validate(updatedData);
        const modifiedPayload = {
          ...payload,
          storage_link: file.path.split("\\")[1],
        };

        await prisma.user
          .update({
            data: modifiedPayload,
            where: {
              id: userId,
            },
          })
          .then((data) => {
            const userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
              verified: data.verified,
              contact_no: data.contact_no,
              storage_link: data.storage_link,
            };
            return res
              .status(200)
              .json({
                email: data.email,
                data: userData,
                token: generateToken(data),
              })
              .catch((error) => {
                throw Error;
              });
          });
      } else {
        removeFile("uploads\\" + userExists.storage_link.toString());
        let updatedPass;
        if (body.old_password && body.new_password) {
          const temp = passMatched(old_password, userExists.password);
          if (temp) {
            updatedPass = body.new_password;
          } else {
            return res.status(400).json({
              message: "You've entered incorrect old password",
            });
          }
        } else {
          updatedPass = userExists.password;
        }
        const updatedData = {
          name: body.user_name ? body.user_name : userExists.name,
          email: userExists.email,
          password: updatedPass,
          contact_no: body.contact_no ? body.contact_no : userExists.contact_no,
        };
        const payload = validator.validate(updatedData);
        const modifiedPayload = {
          ...payload,
          storage_link: file.path.split("\\")[1],
        };

        await prisma.user
          .update({
            data: modifiedPayload,
            where: {
              id: userId,
            },
          })
          .then((data) => {
            const userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
              verified: data.verified,
              contact_no: data.contact_no,
              storage_link: data.storage_link,
            };
            return res.status(200).json({
              email: data.email,
              data: userData,
              token: generateToken(data),
            });
          })
          .catch((error) => {
            throw Error;
          });
      }
    }
  } catch (error) {
    return res.status(400).json({
      messaage: "Couldn't update user",
      error: error.messaage,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userid = req.params.id;

    const userExists = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    if (!userExists) {
      throw Error;
    }
    if (userExists.storage_link) {
      removeFile("uploads\\" + userExists.storage_link.toString());
    }
    await prisma.registeredemails
      .deleteMany({
        where: {
          user_id: userid,
        },
      })
      .then(async () => {
        await prisma.user
          .delete({
            where: {
              id: userid,
            },
          })
          .then(() => {
            res.status(200).json({
              message: `${userExists.name} Deleted Successfully`,
            });
          })
          .catch((error) => {
            throw Error;
          });
      })
      .catch((error) => {
        throw Error;
      });
  } catch (error) {
    res.status(200).json({
      message: "Couldn't delete user.",
      error: error.message,
    });
  }
};
