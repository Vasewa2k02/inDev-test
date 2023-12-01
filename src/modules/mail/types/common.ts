export type Auth = {
  user: string;
  pass?: string;
};

export type Tls = {
  rejectUnauthorized: boolean;
  ciphers: string;
};
