import { CustomError } from "./customError";
import { IRequestBody, IRequestParams } from "../types/requestValidator";

abstract class BaseRequestValidate<T>{
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  public validate(): T {
    return this.data;
  }
}

export class RequestBodyValidator extends BaseRequestValidate<IRequestBody>{
  private readonly emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

  public email(): this {
    const email = this.data.email;

    if (!email) {
      throw new CustomError(400, "Email is required.");
    } else if (!this.emailRegex.test(email)) {
      throw new CustomError(400, "Invalid email format.");
    }
    return this;
  }

  public password(): this {
    const password = this.data.password;

    if (!password) {
      throw new CustomError(400, "Password is required.");
    } else {
      if (password.length < 8 || password.length > 16) {
        throw new CustomError(400, "Password must be between 8 and 16 characters long.");
      }
      if (!/[a-z]/.test(password)) {
        throw new CustomError(400, 
          "Password must contain at least one lowercase letter."
        );
      }
      if (!/[A-Z]/.test(password)) {
        throw new CustomError(400, 
          "Password must contain at least one uppercase letter."
        );
      }
      if (!/\d/.test(password)) {
        throw new CustomError(400, "Password must contain at least one number.");
      }
      if (/[^A-Za-z0-9]/.test(password)) {
        throw new CustomError(400, "Password must contain only letters and numbers.");
      }
    }
    return this;
  }

  public query():this{
    const query: string = this.data.query || '';

    if(query.length < 5 || query.length > 2000){
        throw new CustomError(400, "Query must be between 5 and 2000 characters long.");
    }
    return this
  }
}

export class RequestParamValidator extends BaseRequestValidate<IRequestParams>{
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  public uuid():this{
    const uuid:string = this.data.id || '';
    if(!this.uuidRegex.test(uuid)){
      throw new CustomError(400, "Parameter ID is not a valid uuid v4.");
    }

    return this
  }
}
