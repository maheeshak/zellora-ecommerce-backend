import bcrypt from "bcryptjs";
import { CreateUserDTO } from "../dto/user.dto";
import { Roles, Status } from "../common/enums/enums";
import User from "../models/user.mode";
import RoleModel from "../models/role.model";
import tokenService from "./token.service";
import { CustomError } from "../common/errors/CustomError";


class AuthService {
  public async adminSignup(createUserDto: CreateUserDTO) {
    const { firstName,lastName, email, password, avatar, phone, address } = createUserDto;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.status === Status.INACTIVE) {
        throw new CustomError("Sorry! This account is inactive. Please contact support.", 400);
      }
      throw new CustomError("Sorry! This email is already taken.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await RoleModel.findOne({ name: Roles.ADMIN });
    if (!role) {
      throw new CustomError("Sorry! Role not found.", 400);
    }

    const roleId: string = role._id.toString();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: roleId,
      avatar,
      contact: {
        phone,
        address
      }
    });

    await newUser.save();

    const accessToken = tokenService.generateAccessToken(newUser._id.toString(), roleId);
    const refreshToken = tokenService.generateRefreshToken(newUser._id.toString(), roleId);

    const responseUserDTO = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      avatar: newUser.avatar,
      role: {
        name: role.name
      },
      phone: newUser.contact?.phone || '',
      address: newUser.contact?.address || '',
      tokens: { accessToken, refreshToken },
    };

    return responseUserDTO;
  }

  public async adminSignin(email: string, password: string) {
    const user = await User
      .findOne
      ({
        email,
        status: Status.ACTIVE,
      });

    if (!user) {
      throw new CustomError("Sorry! This email is not registered.", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Sorry! Invalid username or password.", 400);
    }

    const role = await RoleModel.findOne({ _id: user.roleId });
    if (!role) {
      throw new CustomError("Sorry! Role not found.", 400);
    }

    const roleId: string = role._id.toString();
    const accessToken = tokenService.generateAccessToken(user._id.toString(), roleId);
    const refreshToken = tokenService.generateRefreshToken(user._id.toString(), roleId);

    const responseUserDTO = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: {
        name: role.name
      },
      phone: user.contact?.phone || '',
      address: user.contact?.address || '',
      tokens: { accessToken, refreshToken },
    };

    return responseUserDTO;

  }

  public async webSignup(createUserDto: CreateUserDTO) {
    const { firstName,lastName, email, password, avatar, phone, address } = createUserDto;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.status === Status.INACTIVE) {
        throw new CustomError("Sorry! This account is inactive. Please contact support.", 400);
      }
      throw new CustomError("Sorry! This email is already taken.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await RoleModel.findOne({ name: Roles.GUEST });
    if (!role) {
      throw new CustomError("Sorry! Role not found.", 400);
    }

    const roleId: string = role._id.toString();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: roleId,
      contact: {
        phone,
        address
      },
      avatar,
    });

    await newUser.save();

    const accessToken = tokenService.generateAccessToken(newUser._id.toString(), roleId);
    const refreshToken = tokenService.generateRefreshToken(newUser._id.toString(), roleId);

    const responseUserDTO = {
      id: newUser._id,
     firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      avatar: newUser.avatar,
      role: {
        name: role.name
      },
      phone: newUser.contact?.phone || '',
      address: newUser.contact?.address || '',
      tokens: { accessToken, refreshToken },
    };

    return responseUserDTO;
  }

  public async webSignin(email: string, password: string) {
    const user = await User
      .findOne
      ({
        email,
        status: Status.ACTIVE,
      });

    if (!user) {
      throw new CustomError("Sorry! This email is not registered.", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Sorry! Invalid username or password.", 400);
    }

    const role = await RoleModel.findOne({ _id: user.roleId });
    if (!role) {
      throw new CustomError("Sorry! Role not found.", 400);
    }

    const roleId: string = role._id.toString();

    const accessToken = tokenService.generateAccessToken(user._id.toString(), roleId);
    const refreshToken = tokenService.generateRefreshToken(user._id.toString(), roleId);

    const responseUserDTO = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: {
        name: role.name
      },
      phone: user.contact?.phone || '',
      address: user.contact?.address || '',
      tokens: { accessToken, refreshToken },
    };

    return responseUserDTO;

  }



  public async generateAccessToken(refreshToken: string) {
    const { userId } = tokenService.extractToken(refreshToken);
    const user
      = await User.findById(userId);
    if (!user || user.status === Status.INACTIVE) {
      throw new CustomError("Access denied", 401);
    }

    const role = await RoleModel.findOne({ _id: user.roleId });
    if (!role) {
      throw new CustomError("Sorry! Role not found.", 400);
    }

    const roleId: string = role._id.toString();

    const accessToken = tokenService.generateAccessToken(user._id.toString(), roleId);
    return { accessToken };
  }
}

export default new AuthService();
