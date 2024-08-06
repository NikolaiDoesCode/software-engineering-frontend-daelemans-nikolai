import { Rent, Rental } from "@/types";

const getAllRents = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rent", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getRentById = (id: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rent/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getRentByEmail = (email: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rent/email/" + email, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const addRent = (rent: Rent, email:string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rent/addRent/" + email, {
        method: "POST",
        body: JSON.stringify(rent),
        headers: {
        "Content-Type": "application/json",
        },
    });
};

const deleteRent = (id: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rent/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const checkIn = (id: number, fuel: string, mileage: string) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/api/rent/${id}/${fuel}/${mileage}/checkIn`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const checkOut = (id: number, fuel: string, mileage: string) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/api/rent/${id}/${fuel}/${mileage}/checkOut`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const RentService = {
  getAllRents,
  getRentById,
  addRent,
  deleteRent,
  getRentByEmail,
  checkIn,
  checkOut,
};

export default RentService;
