export type Employee = {
  id: string;
  name: string;
  age: number;
  position: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  email: string;
  name: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};
