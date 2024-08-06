import { Car } from "@/types";

// kroepoek

const getAllCars = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/car", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getCarById = (id: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/car/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const addCar = (car: Car, userEmail: string) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/car/" + userEmail, {
    method: "POST",
    body: JSON.stringify(car),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteCar = (id: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/car/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const CarService = {
  getAllCars,
  getCarById,
  addCar,
  deleteCar,
};

export default CarService;
