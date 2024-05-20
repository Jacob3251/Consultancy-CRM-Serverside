import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { userSchma } from "../validation/UserValidation.js";
import { generateToken, hasher } from "../utils/helper.js";
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

    const newUser = await prisma.user.create({
      data: payload,
    });

    if (newUser) {
      res.json({
        status: 200,
        data: newUser,
        token: generateToken(newUser),
        message: "User Created",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Email Already Taken . Please add another email",
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
    res.status(200).json({
      email: userExists.email,
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

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, password, email } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  if (updatedUser) {
    res.json({
      status: 200,
      message: `${updateUser.name} data updated`,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const deleteUser = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  if (deleteUser) {
    res.json({
      status: 200,
      message: "User deleted successfully!!",
    });
  }
};
