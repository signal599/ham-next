import { Address, Location, Station } from "@/lib/map-types";

interface Props {
  location: Location;
}

// The height cap keeps an address with many stations from filling the map —
// on a phone an uncapped popup covers it entirely. The content scrolls inside.
export default function LocationContent({ location }: Props) {
  return (
    <div className="text-sm max-w-64 max-h-[40svh] overflow-y-auto pb-2 pr-3">
      {location.addresses.map((address, i) => (
        <div key={address.id}>
          {i > 0 && <hr className="my-2 border-gray-200" />}
          <AddressContent address={address} />
        </div>
      ))}
    </div>
  );
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
        </a>
        {station.operatorClass && (
          <span className="text-gray-500 text-xs">{station.operatorClass}</span>
        )}
      </div>
      <div className="text-gray-700">{station.name}</div>
    </div>
  );
}
