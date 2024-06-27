export type SessionType = {
    user:    User;
    expires: Date;
}

export type User = {
    name:        string;
    email:       string;
    image:       string;
    accessToken: string;
}