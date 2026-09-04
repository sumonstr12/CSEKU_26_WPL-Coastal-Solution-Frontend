import { useEffect } from "react";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { PhoneCall } from "lucide-react";
import { RiskBadge, StatusBadge } from "@/components/RiskBadge";
import { riskLevelLabel } from "@/data/disasters";
import { RISK_ZONE_STYLE } from "@/data/map";
import { bn } from "@/lib/utils";
const HOME_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>';
const BUOY_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m4.93 19.07 4.24-4.24"/></svg>';
const shelterIcon = L.divIcon({
  className: "",
  html: `<span class="msq msq-teal">${HOME_SVG}</span>`,
  iconSize: [27, 27],
  iconAnchor: [13, 13],
  popupAnchor: [0, -11],
});
const rescueIcon = L.divIcon({
  className: "",
  html: `<span class="msq msq-blue">${BUOY_SVG}</span>`,
  iconSize: [27, 27],
  iconAnchor: [13, 13],
  popupAnchor: [0, -11],
});
const reportIcons = {
  low: L.divIcon({
    className: "",
    html: '<span class="mpin low"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -8],
  }),
  moderate: L.divIcon({
    className: "",
    html: '<span class="mpin moderate"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -8],
  }),
  high: L.divIcon({
    className: "",
    html: '<span class="mpin high"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -8],
  }),
  critical: L.divIcon({
    className: "",
    html: '<span class="mpin critical"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -8],
  }),
};
function Recenter({ focus }) {
  const map = useMap();
  useEffect(() => {
    if (focus) {
      map.flyTo(focus.center, focus.zoom, {
        duration: 1.1,
      });
    }
  }, [focus, map]);
  return null;
}
export default function MapView({
  className,
  scrollWheelZoom = true,
  reports = [],
  shelters = [],
  rescues = [],
  zones = [],
  focus = null,
  center = [22.35, 90.55],
  zoom = 8,
}) {
  return (
    <div
      className={className}
      role="application"
      aria-label="উপকূলীয় দুর্যোগ মানচিত্র"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        className="h-full w-full rounded-[inherit]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/" target="_blank" rel="noreferrer">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Recenter focus={focus} />

        {/* Risk zones */}
        {zones.map((zone) => {
          const style = RISK_ZONE_STYLE[zone.risk];
          return (
            <Circle
              key={zone.district}
              center={[zone.lat, zone.lng]}
              radius={zone.radiusKm * 1000}
              pathOptions={{
                color: style.color,
                weight: 1.6,
                fillColor: style.fillColor,
                fillOpacity: style.fillOpacity,
              }}
            >
              <Popup>
                <p className="text-[14px] font-bold">{zone.district} জেলা</p>
                <p className="mt-0.5 text-[12.5px]">
                  <span className="font-semibold">ঝুঁকির মাত্রা:</span>{" "}
                  {riskLevelLabel(zone.risk)}
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-500">{zone.note}</p>
              </Popup>
            </Circle>
          );
        })}

        {/* Citizen reports / disaster markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={reportIcons[report.severity]}
          >
            <Popup>
              <div className="min-w-[190px]">
                <p className="text-[14px] leading-snug font-bold">
                  {report.title}
                </p>
                <p className="mt-1 text-[12.5px] text-ink-500">
                  {report.district} • {report.upazila}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <RiskBadge level={report.severity} />
                  <StatusBadge status={report.status} />
                </div>
                <p className="mt-1.5 text-[12px] text-ink-500">{report.date}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Shelters */}
        {shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[shelter.lat, shelter.lng]}
            icon={shelterIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <p className="text-[14px] leading-snug font-bold">
                  {shelter.name}
                </p>
                <p className="mt-1 text-[12.5px] text-ink-500">
                  {shelter.address}
                </p>
                <p className="mt-1 text-[12.5px]">
                  <span className="font-semibold">ধারণক্ষমতা:</span>{" "}
                  {bn(shelter.capacity.toLocaleString("en-IN"))} জন •{" "}
                  <span className="font-semibold">অবস্থা:</span>{" "}
                  {shelter.status}
                </p>
                <a
                  href={`tel:${shelter.contact}`}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-2.5 py-1 text-[12.5px] font-bold text-white no-underline"
                >
                  <PhoneCall className="h-3 w-3" aria-hidden="true" />
                  {bn(shelter.contact.replace(/(\d{5})(\d+)/, "$1-$2"))}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rescue teams */}
        {rescues.map((team) => (
          <Marker
            key={team.id}
            position={[team.lat, team.lng]}
            icon={rescueIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <p className="text-[14px] leading-snug font-bold">
                  {team.name}
                </p>
                <p className="mt-1 text-[12.5px] text-ink-500">{team.base}</p>
                <p className="mt-1 text-[12.5px]">{team.focus}</p>
                <a
                  href={`tel:${team.contact}`}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1 text-[12.5px] font-bold text-white no-underline"
                >
                  <PhoneCall className="h-3 w-3" aria-hidden="true" />
                  {bn(team.contact.replace(/(\d{5})(\d+)/, "$1-$2"))}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
