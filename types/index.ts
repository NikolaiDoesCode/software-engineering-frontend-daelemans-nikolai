// export type Car = {
//   id?: number;
//   brand: string;
//   model?: string;
//   licensePlate: string;
//   type: CarType;
//   numberOfSeats?: number;

// };

export type Car = {
  id?: number;
  brand: string;
  model: string;
  type?: CarType;
  licensePlate: string;
  numberOfSeats?: number;
  numberOfChildSeats?: number;
  foldingRearSeat?: boolean;
  towBar?: boolean;
  rentals?: Rental[];
};

export type Rental = {
  id?: number;
  car?: Car;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  street: string;
  number: string;
  postal: string;
  city: string;
  phoneNumber: string;
  email: string;
  price: number;
};

export type StatusMessage = {
  id?: number;
  message: string;
  type?: "error" | "success";
};

export enum CarType {
  SUV = "SUV",
  COUPE = "COUPE",
  SPORT = "SPORT",
}

export type Rent = {
  id?: number;
  phoneNumberRenter: string;
  emailRenter: string;
  nationalRegisterId: string;
  birthDate: string;
  drivingLicenseNumber: string;
  rental?: Rental;
  car?: Car;
  checkedIn?: Boolean;
  checkedOut?: Boolean;
  dateCheckIn?: Date;
  dateCheckOut?: Date;
};

export type Notification = {
  id?: number;
  rentId?: number;
  brand: string;
  type: CarType;
  licensePlate: string;
  startDate: string;
  endDate: string;
  emailOwner: string;
  emailRenter: string;
  notificationType: NotificationType;
  notificationStatus: NotificationStatus;
};

export type loginUser = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: Role;
  isAdmin?: boolean;
  isAccountant?: boolean;
  cars?: Car[];
  joinedGroupchats?: Groupchat[];
  messages?: Message[];
};

export type Billing = {
  id?: number;
  owner: User;
  renter: User;
  cost: number;
  startDate: Date;
  endDate: Date;
};

export enum Role {
  OWNER = "OWNER",
  RENTER = "RENTER",
}

export enum NotificationType {
  RENT = "RENT",
  CONFIRM = "CONFIRM",
  CANCEL = "CANCEL",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  ARCHIVED = "ARCHIVED",
}

export type MailRequest = {
  to: string;
  subject: string;
  text: string;
};

export type MessageInput = {
  text: string;
};

export type Message = {
  id?: number;
  text: string;
  time?: string;
  user?: User;
};

export type Groupchat = {
  id?: number;
  messages?: Message[];
  users?: User[];
};
