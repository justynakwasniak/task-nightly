import { Validator } from "@/src/lib/validators";

type Props = {
  selected: Validator;
  onClose: () => void;
};

export default function ValidatorMobileSheet({ selected, onClose }: Props) {
  return (
    <div className="fixed md:hidden bottom-6 left-4 right-4 z-50">
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl p-5 text-white transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold tracking-tight truncate">
            {selected.name}
          </h2>

          <button
            className="text-gray-400 hover:text-violet-400 transition-colors text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ["Stake", `${selected.stake?.toLocaleString()} IOTA`],
            ["Status", selected.status],
            ["Uptime", `${selected.uptime?.toFixed(2)}%`],
            ["Lat", `${selected.lat.toFixed(2)}°`],
            ["Lng", `${selected.lng.toFixed(2)}°`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <p className="text-gray-500 uppercase text-[10px] tracking-wider">
                {label}
              </p>

              <p
                className={`mt-1 ${
                  label === "Status"
                    ? selected.status === "active"
                      ? "text-violet-400"
                      : "text-gray-400"
                    : "font-mono"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
