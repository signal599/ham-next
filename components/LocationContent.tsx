import { Address, Location, Station } from "@/lib/map-types";

interface Props {
  location: Location;
}

// The height cap keeps an address with many stations from overflowing the map,
// which clips the popup rather than scrolling it. The worst case is a pin in
// the middle of the map, leaving half the map's height — the map is 70svh
// capped at 600px — for the popup to open into, less the 28px it is offset off
// the pin and the 40px of MapLibre's own popup chrome. The content scrolls
// inside whatever that leaves.
export default function LocationContent({ location }: Props) {
  return (
    <div className="text-sm max-w-64 max-h-[calc(min(35svh,300px)-68px)] overflow-y-auto pr-3">
      {location.addresses.map((address, i) => (
        <div key={address.id}>
          {i > 0 && <hr className="my-2 border-gray-200" />}
          <AddressContent address={address} />
        </div>
      ))}

      <p className="mt-2">
        <a
          href={mapsUrl(location.lat, location.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs"
        >
          Google Maps
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </div>
  );
}

// Every address here shares the location's coordinates, so this belongs to the
// popup rather than to any one of them. Google's documented Maps URL format,
// which opens the app on a phone and the site on a desktop; it lands on the map
// rather than in Street View, which is a step away once there and is not always
// available at a given point.
function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

interface AddressContentProps {
  address: Address;
}

function AddressContent({ address }: AddressContentProps) {
  return (
    <div>
      {address.stations.map((station) => (
        <StationContent key={station.id} station={station} />
      ))}
      <p className="mt-1 text-gray-600">
        {address.address1}
        {address.address2 && (
          <>
            <br />
            {address.address2}
          </>
        )}
        <br />
        {address.city}, {address.state} {address.zip}
      </p>
    </div>
  );
}

interface StationContentProps {
  station: Station;
}

function StationContent({ station }: StationContentProps) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{station.callsign}</span>

        <a
          href={`https://www.qrz.com/db/${station.callsign}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          qrz.com
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        {station.operatorClass && (
          <span className="text-gray-500 text-xs">{station.operatorClass}</span>
        )}
      </div>
      <div className="text-gray-700">{station.name}</div>
    </div>
  );
}
