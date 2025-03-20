import jwt from "jsonwebtoken";
import { CustomError } from "../common/errors/CustomError";

class TokenService {

  public generateAccessToken(userId: string, roleId: string): string {
    return jwt.sign(
      { userId, type: "acc", roleId: roleId },
      process.env.JWT_SECRET as string,
      { expiresIn: "10h" }
    );
  }

  public generateRefreshToken(userId: string, roleId: string): string {
    return jwt.sign(
      { userId, type: "ref", roleId: roleId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
  }

  public extractToken(token: string): { userId: string, type: string , roleId: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, type: string, roleId: string };
      return decoded;
    } catch (error) {
      throw new CustomError("Access Denied", 401);
    }
  }

}



export default new TokenService();
