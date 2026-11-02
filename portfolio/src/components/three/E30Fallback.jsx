import { E30_PAINT } from './e30Paint'

export default function E30Fallback() {
  return (
    <div className="scene-fallback e30-fallback" aria-hidden="true">
      <svg viewBox="0 0 640 340" fill="none">
        <defs>
          <linearGradient
            id="e30-paint"
            x1="240"
            y1="105"
            x2="300"
            y2="260"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={E30_PAINT.illustration.highlight} />
            <stop offset=".5" stopColor={E30_PAINT.illustration.base} />
            <stop offset="1" stopColor={E30_PAINT.illustration.shadow} />
          </linearGradient>
          <linearGradient
            id="e30-side"
            x1="300"
            y1="180"
            x2="300"
            y2="270"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={E30_PAINT.illustration.sideHighlight} />
            <stop offset="1" stopColor={E30_PAINT.illustration.sideShadow} />
          </linearGradient>
          <radialGradient id="e30-shadow">
            <stop stopColor="#050905" stopOpacity=".6" />
            <stop offset="1" stopColor="#050905" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="326" cy="279" rx="247" ry="40" fill="url(#e30-shadow)" />
        <path
          d="m91 209 75-53 328-9 79 50-2 44-39 17-415-4-27-20Z"
          fill="url(#e30-side)"
          stroke="#69745e"
        />
        <path
          d="m92 209 75-53 167-4-19 44Z"
          fill="url(#e30-paint)"
          stroke="#939a87"
        />
        <path
          d="m334 152 23-58 103 1 40 53-30 17-96 1Z"
          fill="#c9d9cf"
          fillOpacity=".26"
          stroke="#d6dbce"
          strokeWidth="5"
        />
        <path
          d="m346 153 24-49 82 2 34 42-20 8Z"
          fill="#b0c6b8"
          fillOpacity=".16"
        />
        <path d="m340 161 125-4 41 25-158 7Z" fill="#493b2b" stroke="#8b7757" />
        <path
          d="m364 162 5-26 29 1 7 25m25-2 1-24 28-1 9 24"
          fill="#252824"
          stroke="#4b5046"
          strokeWidth="4"
        />
        <path
          d="m499 149 46 22 28 26-65-15-43-25Z"
          fill="url(#e30-paint)"
          stroke="#939a87"
        />
        <path d="m92 218 227 13 251-23" stroke="#333c2e" strokeWidth="9" />
        <path d="m94 220 225 15 248-23" stroke="#a6ada0" strokeWidth="2" />
        <path d="m316 196 3 57m111-65 4 63" stroke="#6c7563" />
        <path d="m395 198 23-2" stroke="#505a46" strokeWidth="4" />
        {[170, 490].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy="250" rx="40" ry="45" fill="#111611" />
            <ellipse
              cx={cx}
              cy="250"
              rx="28"
              ry="33"
              fill="#b7beac"
              stroke="#59644e"
              strokeWidth="3"
            />
            <ellipse cx={cx} cy="250" rx="22" ry="27" fill="#27301f" />
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d={`M${cx} 250 l${Math.cos((i * Math.PI) / 6) * 23} ${Math.sin((i * Math.PI) / 6) * 27}`}
                stroke="#b9c1ae"
                strokeWidth="2"
              />
            ))}
            <ellipse cx={cx} cy="250" rx="6" ry="7" fill="#77856b" />
          </g>
        ))}
        <path
          d="m91 210 4 23 221 13 1-30Z"
          fill="#171f14"
          stroke="#a9b29e"
          strokeWidth="2"
        />
        {[115, 143, 268, 296].map((cx) => (
          <ellipse
            key={cx}
            cx={cx}
            cy="226"
            rx="11"
            ry="10"
            fill="#dbe6c3"
            stroke="#8e9d78"
            strokeWidth="2"
          />
        ))}
        <path
          d="m196 220 17 1-1 15-17-1Zm22 1 17 1-1 15-17-1Z"
          fill="#10170d"
          stroke="#a3b092"
          strokeWidth="2"
        />
        <path d="m103 246 194 12" stroke="#c2ccaf" strokeWidth="4" />
        <rect
          x="179"
          y="244"
          width="48"
          height="13"
          rx="2"
          transform="rotate(4 179 244)"
          fill="#cdd5bd"
        />
        <text
          x="185"
          y="253"
          fill="#3e4c31"
          fontFamily="monospace"
          fontSize="7"
        >
          E30 · 89
        </text>
      </svg>
    </div>
  )
}
