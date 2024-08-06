import { Car } from "@/types";
import { useState } from "react";


type RentalCarInfoProps = {
    car: Car;
}

const RentalCarInfo : React.FC<RentalCarInfoProps> = ({car}) => {
    
    return (
        <div>
            <h2>CAR CAR</h2>
            <p>{car.brand} {car.model}</p>
            <p>{car.licensePlate}</p>
        </div>
    )


}

export default RentalCarInfo;