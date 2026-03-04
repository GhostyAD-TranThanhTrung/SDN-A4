export interface User {
    _id?: string;
    user: string;
    password?: string;
    admin: boolean;
}

export interface CreateUserDto {
    user: string;
    password: string;
    admin: boolean;
}

export interface LoginDto {
    user: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    admin: boolean;
}

export interface UserResponse {
    _id: string;
    user: string;
    admin: boolean;
    // password excluded for security
}
