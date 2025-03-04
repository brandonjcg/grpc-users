export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IGetUserByIdResponse {
  success: boolean;
  message?: string;
  user: IUser;
}
