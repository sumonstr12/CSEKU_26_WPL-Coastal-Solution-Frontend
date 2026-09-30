import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MapPin, Warehouse } from "lucide-react";
import { bn, bnNum } from "../../utils/format";

const BANGLADESH_PRESENTATION_CENTER = [23.685, 90.3563];
const SEVERITY_COLORS = {
  LOW: "#059669",
  MODERATE: "#d97706",
  HIGH: "#ea580c",
  CRITICAL: "#dc2626",
};
const SHELTER_ICON = L.divIcon({
  className: "",
  html: '<span class="msq msq-teal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>',
  iconSize: [27, 27],
  iconAnchor: [13, 13],
  popupAnchor: [0, -11],
});

function toPosition(latitude, longitude) {
  if (latitude == null || longitude == null || latitude === "" || longitude === "") return null;
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

function reportMarker(severity) {
  const color = SEVERITY_COLORS[severity] || "#64748b";
  return L.divIcon({
    className: "",
    html: `<span class="mpin" style="background:${color};color:${color}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -8],
  });
}

function reportTitle(report) {
  return report.title_bn || report.title || report.category?.name_bn || report.category?.name || "";
}

function reportPlace(report) {
  return [report.village, report.union, report.upazila, report.district]
    .filter(Boolean)
    .join(", ");
}

function shelterPlace(shelter) {
  return [shelter.address, shelter.village, shelter.union, shelter.upazila, shelter.district]
    .filter(Boolean)
    .join(", ");
}

export default function VolunteerLiveMap({ reports = [], shelters = [], area, errors = {} }) {
  const locatedReports = useMemo(
    () => reports
      .map((report) => ({ report, position: toPosition(report.latitude, report.longitude) }))
      .filter(({ position }) => position),
    [reports],
  );
  const locatedShelters = useMemo(
    () => shelters
      .map((shelter) => ({ shelter, position: toPosition(shelter.latitude, shelter.longitude) }))
      .filter(({ position }) => position),
    [shelters],
  );
  const center = locatedReports[0]?.position
    || locatedShelters[0]?.position
    || BANGLADESH_PRESENTATION_CENTER;
  const hasMarkers = locatedReports.length > 0 || locatedShelters.length > 0;
  const errorMessages = Object.values(errors).filter(Boolean);

  return (
    <section aria-label="স্বেচ্ছাসেবকের এলাকার লাইভ মানচিত্র">
      {(area?.district || area?.upazila) && (
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin size={15} className="text-lagoon-600" />
          {[area.upazila, area.district].filter(Boolean).join(", ")} এলাকার লাইভ মানচিত্র
        </p>
      )}

      {errorMessages.length > 0 && (
        <div role="alert" className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errorMessages.join(" ")}
        </div>
      )}

      {!hasMarkers && (
        <p className="mb-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          এই এলাকায় বর্তমানে কোনো রিপোর্ট বা আশ্রয়কেন্দ্রের অবস্থান পাওয়া যায়নি।
        </p>
      )}

      <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-card sm:h-[500px] lg:h-[560px]">
        <MapContainer
          center={center}
          zoom={hasMarkers ? 9 : 7}
          scrollWheelZoom
          className="h-full w-full"
          aria-label="স্বেচ্ছাসেবকের এলাকার ইন্টারেক্টিভ মানচিত্র"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locatedReports.map(({ report, position }) => (
            <Marker
              key={`incident-${report.id}`}
              position={position}
              icon={reportMarker(report.severity)}
            >
              <Popup>
                <div className="min-w-[190px]">
                  {reportTitle(report) && <p className="text-sm font-bold">{reportTitle(report)}</p>}
                  {reportPlace(report) && <p className="mt-1 text-xs text-slate-500">{reportPlace(report)}</p>}
                  {report.status && <p className="mt-1 text-xs"><b>অবস্থা:</b> {report.status}</p>}
                  {report.severity && report.severity !== "UNKNOWN" && (
                    <p className="text-xs"><b>গুরুত্ব:</b> {report.severity}</p>
                  )}
                  {report.affected_people_estimate != null && (
                    <p className="text-xs"><b>ক্ষতিগ্রস্ত:</b> {bnNum(report.affected_people_estimate)} জন</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {locatedShelters.map(({ shelter, position }) => (
            <Marker key={`shelter-${shelter.id}`} position={position} icon={SHELTER_ICON}>
              <Popup>
                <div className="min-w-[190px]">
                  {shelter.name && <p className="text-sm font-bold">{shelter.name}</p>}
                  {shelterPlace(shelter) && <p className="mt-1 text-xs text-slate-500">{shelterPlace(shelter)}</p>}
                  {shelter.active != null && <p className="mt-1 text-xs"><b>সক্রিয়:</b> {shelter.active ? "হ্যাঁ" : "না"}</p>}
                  {shelter.status && <p className="text-xs"><b>অবস্থা:</b> {shelter.status}</p>}
                  {shelter.capacity != null && <p className="text-xs"><b>ধারণক্ষমতা:</b> {bnNum(shelter.capacity)} জন</p>}
                  {Array.isArray(shelter.facilities) && shelter.facilities.length > 0 && (
                    <p className="mt-1 text-xs"><b>সুবিধা:</b> {shelter.facilities.join(", ")}</p>
                  )}
                  {(shelter.water != null || shelter.power != null) && (
                    <p className="mt-1 text-xs">
                      {[
                        shelter.water != null && `পানি: ${shelter.water ? "আছে" : "নেই"}`,
                        shelter.power != null && `বিদ্যুৎ: ${shelter.power ? "আছে" : "নেই"}`,
                      ].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {hasMarkers && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-orange-600" />রিপোর্ট: {bn(locatedReports.length)}</span>
          <span className="inline-flex items-center gap-1.5"><Warehouse size={13} className="text-teal-700" />আশ্রয়কেন্দ্র: {bn(locatedShelters.length)}</span>
        </div>
      )}
    </section>
  );
}
