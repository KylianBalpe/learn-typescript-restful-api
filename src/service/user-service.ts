import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prisma} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import {User} from "@prisma/client";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request);

    const uniqueName = await prisma.user.findUnique({
      where: {
        username: registerRequest.username
      }
    })

    if (uniqueName) {
      throw new ResponseError(400, "Username sudah ada!")
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await prisma.user.create({
      data: registerRequest
    });

    return toUserResponse(user);
  };

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prisma.user.findUnique({
      where: {
        username: loginRequest.username
      }
    })

    if (!user) {
      throw new ResponseError(401, "Username atau password salah!")
    }

    const passwordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!passwordValid) {
      throw new ResponseError(401, "Username atau password salah!")
    }

    user = await prisma.user.update({
      where: {
        username: loginRequest.username
      },
      data: {
        token: uuid()
      }
    })

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prisma.user.update({
      where: {
        username: user.username
      },
      data: user
    });

    return toUserResponse(result);
  }

  static async logout(user: User): Promise<UserResponse> {
    const result = await prisma.user.update({
      where: {
        username: user.username
      },
      data: {
        token: null
      }
    });

    return toUserResponse(result);
  }
}