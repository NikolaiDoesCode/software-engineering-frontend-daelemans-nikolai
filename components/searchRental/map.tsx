import StatusMessageList from '@/components/errors/statusMessageList';
import { useEffect, useRef, useState } from 'react';
import { Rental, StatusMessage } from '@/types';

import { useRouter } from "next/router";
import rentalService from '@/service/rentalService';
import * as L from "leaflet";

type Props = {
    baseAdress: string;
    rentals: Rental[];
}

const MapComponent: React.FC<Props> = ({ rentals, baseAdress }: Props) => {
    const polygonCoords: L.LatLngExpression[] = [
        [50.8861703, 4.6970477],
        [50.8842345, 4.6982493],
        [50.8831515, 4.6984425],
        [50.8824069, 4.6987858],
        [50.8818112, 4.6992793],
        [50.881378, 4.6994295],
        [50.8814728, 4.6988072],
        [50.88173, 4.698185],
        [50.8818518, 4.6977773],
        [50.8820143, 4.6970477],
        [50.8817706, 4.6969404],
        [50.8813238, 4.6967473],
        [50.8809177, 4.6965756],
        [50.8804168, 4.6963611],
        [50.8806063, 4.6946874],
        [50.8808906, 4.6917906],
        [50.8811478, 4.6904173],
        [50.882082, 4.6911469],
        [50.8827453, 4.6915546],
        [50.8835441, 4.6919837],
        [50.8840856, 4.6922841],
        [50.884776, 4.6927133],
        [50.8857236, 4.6930995],
        [50.8866035, 4.6947947],
        [50.8869554, 4.6961894],
        [50.8866441, 4.6966829],
        [50.8862109, 4.6970477],
    ];
    const [searchRentalsMessages, setSearchRentalsMessages] = useState<StatusMessage[] | null>(null);
    const [searchRentalsError, setSearchRentalsError] = useState<string | null>(null);

    const [markerGroup, setMarkerGroup] = useState<L.LayerGroup<any> | null>(null);
    const [mapInitialized, setMapInitialized] = useState<boolean>(false);

    const mapRef = useRef<L.Map | null>(null); // Create a ref object
    const myIcon = L.icon({
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
    });

    useEffect(() => {
        if (mapInitialized && mapRef.current) {
            const circle = L.circle([50.874, 4.700], {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.2,
                radius: 500,
            }).addTo(mapRef.current);
            circle.bindPopup("Low popular region");
            mapRef.current.flyTo([50.878, 4.700], 12);

            const circle2 = L.circle([50.878, 4.710], {
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.2,
                radius: 200,
            }).addTo(mapRef.current);
            circle2.bindPopup("Highly popular region");
            mapRef.current.flyTo([50.878, 4.700], 12);
            const polygon = L.polygon(polygonCoords, {
                color: 'orange',
                fillColor: 'orange',
                fillOpacity: 0.2,
            }).addTo(mapRef.current);
            polygon.bindPopup("Medium popular region");
            mapRef.current.flyTo([50.878, 4.715], 12);
        }
    }, [mapInitialized]);

    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current) {
            const map = L.map('map').setView([50.878, 4.700], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapRef.current = map;
            setMarkerGroup(L.layerGroup().addTo(map));
            setMapInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (mapInitialized) {
            flyToBaseAdressAndSetMarkers(rentals, baseAdress);
        }
    }, [baseAdress, mapInitialized]);

    const flyToBaseAdressAndSetMarkers = async (rentals: Rental[], baseAdress: string) => {
        const coordinatesBaseAdress = await fetch('https://nominatim.openstreetmap.org/search.php?' + baseAdress + 'format=jsonv2');
        const coordinatesBaseAdressData = await coordinatesBaseAdress.json();

        if (coordinatesBaseAdressData.length === 0) {
            setSearchRentalsMessages([{ type: "error", message: "Address was not found" }]);
            return null;
        }

        setMarkersOfRentals(rentals)

        if (mapRef.current) {
            mapRef.current.flyTo([coordinatesBaseAdressData[0].lat, coordinatesBaseAdressData[0].lon], 12);
        }

    }

    const setMarkersOfRentals = async (rentals: Rental[]) => {
        if (!mapRef.current) {
            // Map is not yet initialized, retry after a brief delay
            setTimeout(() => setMarkersOfRentals(rentals), 100);
            return;
        }

        if (markerGroup) {
            markerGroup.clearLayers();
        }

        // Map all fetch calls to an array of promises
        if (rentals) {
            const markerPromises = rentals.map(async (element, index) => {
                let elementAdress = "";
                // https://nominatim.openstreetmap.org/search.php?street=Diestsestraat+206&city=Leuven&country=Belgium&postalcode=3000&format=jsonv2
                if (element.street && element.number) {
                    elementAdress += `street=${element.street}+${element.number}&`;
                }
                else if (element.street) {
                    elementAdress += `street=${element.street}&`;
                }

                if (element.city) elementAdress += `city=${element.city}&`;
                if (element.postal) elementAdress += `postalcode=${element.postal}&`;

                const coordinatesElementAdress = await fetch('https://nominatim.openstreetmap.org/search.php?' + elementAdress + 'format=jsonv2');
                const coordinatesElementAdressData = await coordinatesElementAdress.json();


                if (coordinatesElementAdressData.length > 0 && coordinatesElementAdressData[0].lat && coordinatesElementAdressData[0].lon && mapRef.current) {
                    const marker = L.marker([coordinatesElementAdressData[0].lat, coordinatesElementAdressData[0].lon], { icon: myIcon }).addTo(markerGroup!);
                    marker.bindPopup(`<b>${element.street} ${element.number}, ${element.city} ${element.postal}</b><br>Rental number ${index + 1}`);
                }
            });
            await Promise.all(markerPromises);
        }
    }

    return (
        <>
            {typeof window !== "undefined" && <div id="map" className="w-auto h-96"></div>}
        </>
    )
}

export default MapComponent;
