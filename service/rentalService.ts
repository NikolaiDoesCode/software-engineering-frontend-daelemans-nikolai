import { Rental } from "@/types";

const getAllRentals = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/rental", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getRentalById = (id: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/rental/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const addRental = (carId: number, rental: Rental) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/rental/${carId}/addRental`,
    {
      method: "POST",
      body: JSON.stringify(rental),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const searchRentals = (
  email: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  brand: string | undefined
) => {
  let url = process.env.NEXT_PUBLIC_API_URL + "/api/rental/search?";
  if (email) url += `email=${email}&`;
  if (startDate) url += `startDate=${startDate}&`;
  if (endDate) url += `endDate=${endDate}&`;
  if (brand) url += `brand=${brand}&`;

  url = url.slice(0, -1);
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const cancelRental = (id: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/rental/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const RentalService = {
  getAllRentals,
  addRental,
  cancelRental,
  searchRentals,
  getRentalById,
};

export default RentalService;
