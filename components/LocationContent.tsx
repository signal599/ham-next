import { Address, Location, Station } from "@/lib/map-types";

interface Props {
  location: Location;
}

export default function LocationContent({ location }: Props) {
  return (
    <div>
      {location.addresses.map((address) => (
        <AddressContent key={address.id} address={address} />
      ))}
    </div>
  )
}

interface AddressContentProps {
  address: Address;
}

function AddressContent({ address }: AddressContentProps) {
  return (
    <div>
      {address.stations.map((station) => (
        <span key={station.id}>
          <StationContent station={station} />
          <br />
        </span>
      ))}
      {address.address1}
      <br />
      {address.address2}
      {address.address2 && <br />}
      {address.city}, {address.city} {address.state}
    </div>
  )
}

interface StationContentProps {
  station: Station;
}

function StationContent({ station }: StationContentProps) {
  return (
    <div>
      <span>{station.callsign}</span>
      <a href="https://www.qrz.com/db/{station.callsign}" target="_blank">
        qrz.com
      </a>
      {station.operatorClass}
      <br />
      {station.name}
    </div>
  );
}
