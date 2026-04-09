export interface LoginResponse {
    token: string;
}


export interface LoginRequest {
    correo: string;
    contrasena: string;
}