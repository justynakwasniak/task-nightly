import { Validator } from "@/src/lib/validators";

type Props = {
  selected: Validator;
  onClose: () => void;
};

export default function ValidatorPanel({ selected, onClose }: Props) {
  return (
    <div className="hidden md:block absolute top-0 right-0 w-80 h-full bg-black/60 backdrop-blur-xl border-l border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] text-white p-6 overflow-y-auto custom-scrollbar transition-all duration-300">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-violet-400 transition-colors text-2xl"
        onClick={onClose}
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-6">
        {selected.name}
      </h2>

      <div className="space-y-3 text-sm">
        {[
          ["ID", selected.id],
          ["Lat", `${selected.lat.toFixed(4)}°`],
          ["Lng", `${selected.lng.toFixed(4)}°`],
          ["Stake", `${selected.stake?.toLocaleString()} IOTA`],
          ["Status", selected.status],
          ["Uptime", `${selected.uptime?.toFixed(2)}%`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
          >
            <p className="text-gray-500 uppercase text-[11px] tracking-wider">
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
  );
}
