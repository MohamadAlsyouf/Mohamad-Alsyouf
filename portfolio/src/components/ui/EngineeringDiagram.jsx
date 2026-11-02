// Original line studies informed by the references in docs/visual-references.md.
// These are decorative illustrations, not manufacturing or assembly drawings.
const sequence = (count) => Array.from({ length: count }, (_, i) => i)

function PiBoard() {
  return (
    <g>
      <rect x="38" y="54" width="264" height="174" rx="12" />
      {[
        [49, 65],
        [49, 216],
        [290, 65],
        [290, 216],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
      ))}
      <rect x="105" y="104" width="55" height="55" rx="3" />
      <rect
        x="116"
        y="115"
        width="33"
        height="33"
        rx="2"
        className="diagram-wash"
      />
      <rect x="179" y="116" width="38" height="42" rx="2" />
      <rect x="100" y="177" width="55" height="22" rx="2" />
      <rect x="237" y="90" width="73" height="47" rx="2" />
      <rect x="237" y="143" width="73" height="47" rx="2" />
      <rect x="247" y="196" width="63" height="36" rx="2" />
      <path d="M247 105h53m-53 18h53m-53 34h53m-53 18h53m-44 30h30v18h-30z" />
      <rect x="85" y="64" width="145" height="21" rx="2" />
      {sequence(20).map((i) => (
        <g key={i}>
          <circle cx={90 + i * 7} cy="70" r="1.5" />
          <circle cx={90 + i * 7} cy="79" r="1.5" />
        </g>
      ))}
      {sequence(9).map((i) => (
        <g key={i}>
          <path
            d={`M${109 + i * 5.4} 103v-8m0 64v9M96 ${109 + i * 5.4}h8m57 0h8`}
          />
          <path
            d={`M${70 + i * 16} 214v-6l12-12v-21`}
            className="diagram-fine"
          />
        </g>
      ))}
      <rect x="46" y="117" width="22" height="34" rx="2" />
      <path d="M75 227v10h29v-10m18 0v10h26v-10m22 0v8h35v-8M55 92h27v36h15m73-34h34v12m-34 66h18v27h40M69 170h14v-21h13" />
      <path
        d="M38 38h264m-264-6v12m264-12v12M22 54v174m-6-174h12m-12 174h12"
        className="diagram-guide"
      />
    </g>
  )
}

function Camera() {
  return (
    <g>
      <path d="M128 178v51q0 13 12 13h63q13 0 13-13v-28" />
      {sequence(11).map((i) => (
        <path
          key={i}
          d={`M${133 + i * 7.5} 182v43q0 9 9 9h59`}
          className="diagram-fine"
        />
      ))}
      <rect x="70" y="40" width="189" height="150" rx="6" />
      <rect
        x="80"
        y="50"
        width="169"
        height="130"
        rx="3"
        className="diagram-fine"
      />
      {[
        [84, 54],
        [245, 54],
        [84, 176],
        [245, 176],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
      ))}
      <path d="M117 75l18-16h60l18 16v77l-18 16h-60l-18-16z" />
      <circle cx="165" cy="114" r="44" />
      <circle cx="165" cy="114" r="34" />
      <circle cx="165" cy="114" r="24" />
      <circle cx="165" cy="114" r="13" className="diagram-wash" />
      <path
        d="m147 95 36 38m-48-14 53-10m-36 37 10-57"
        className="diagram-fine"
      />
      <path d="M95 82h10v17H95zm132 49h10v21h-10zM139 183h52" />
      <path
        d="M165 24v24m0 131v25M54 114h24m174 0h24M70 23h189m-189-5v10m189-10v10"
        className="diagram-guide"
      />
    </g>
  )
}

function Engine() {
  return (
    <g transform="translate(8 2)">
      <path
        d="M56 49h210l18 17v157l-18 17H56l-16-15V66z"
        className="diagram-fine"
      />
      <path d="M146 46h83l12 12v180l-12 13h-83l-11-13V58z" />
      <rect x="155" y="58" width="61" height="179" rx="9" />
      <path
        d="M163 69v153m6-153v153m39-153v153m6-153v153"
        className="diagram-fine"
      />
      {sequence(6).map((i) => (
        <g key={i}>
          <path
            d={`M145 ${70 + i * 27}h-27q-19 0-19 15v2H70v-12q0-23 24-23h39`}
          />
          <rect x="178" y={69 + i * 26} width="22" height="17" rx="3" />
          <circle cx="185" cy={77 + i * 26} r="3" />
          <path
            d={`M241 ${73 + i * 26}h19l10 11v9h-29`}
            className="diagram-fine"
          />
        </g>
      ))}
      <path d="M47 61h21v166H47q-14 0-14-15V76q0-15 14-15zM43 76v135m9-135v135m9-135v135" />
      <circle cx="190" cy="219" r="12" />
      <circle cx="190" cy="219" r="7" />
      <path d="M49 227v21h50l23-18m-3 14v13h37m60-3h41v-17m13-50h23v28h-23M87 41v-13h43v13" />
      <path
        d="M23 36h259M23 29v14m259-14v14m-93-19v239"
        className="diagram-guide"
      />
    </g>
  )
}

function Drone() {
  return (
    <g>
      <path d="m142 108-66-47-9 12 67 66m56-31 66-47 9 12-67 66m-56 13-66 52-9-13 67-66m56 27 66 52 9-13-67-66" />
      {[
        [65, 62],
        [264, 62],
        [65, 207],
        [264, 207],
      ].map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="48" className="diagram-guide" />
          <circle cx={x} cy={y} r="11" />
          <circle cx={x} cy={y} r="5" />
          {[0, 120, 240].map((angle) => (
            <path
              key={angle}
              transform={`rotate(${angle + index * 25} ${x} ${y})`}
              d={`M${x - 4} ${y - 8}q-14-35-2-37 13-1 12 39z`}
            />
          ))}
        </g>
      ))}
      <path d="m151 83 31 0 17 24-2 62-13 23h-34l-14-23-1-62z" />
      <rect
        x="145"
        y="110"
        width="42"
        height="49"
        rx="7"
        className="diagram-wash"
      />
      <path d="M153 118h26m-26 7h26m-26 7h26m-26 7h26m-26 7h26M151 96h31" />
      <rect x="153" y="181" width="27" height="21" rx="6" />
      <circle cx="166" cy="193" r="7" />
      <path
        d="M166 27v49m0 133v37M16 134h106m86 0h105"
        className="diagram-guide"
      />
    </g>
  )
}

function Wheel() {
  return (
    <g>
      <path d="M166 8v252" className="diagram-guide" />
      <g className="wheel-barrel">
        <ellipse cx="166" cy="60" rx="99" ry="37" />
        <ellipse cx="166" cy="60" rx="87" ry="29" />
        <path d="M67 60v37c0 22 44 38 99 38s99-16 99-38V60M78 78v23m176-23v23" />
        <path
          d="M67 87c0 22 44 38 99 38s99-16 99-38"
          className="diagram-fine"
        />
      </g>
      <g className="wheel-center">
        <ellipse cx="166" cy="151" rx="99" ry="37" />
        <ellipse cx="166" cy="151" rx="82" ry="30" />
        {sequence(20).map((i) => {
          const a = (i * Math.PI) / 10
          const x = 166 + 88 * Math.cos(a),
            y = 151 + 32 * Math.sin(a)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="1.7" />
              <path
                d={`M${166 + 25 * Math.cos(a)} ${151 + 10 * Math.sin(a)}L${166 + 77 * Math.cos(a + 0.32)} ${151 + 28 * Math.sin(a + 0.32)}L${166 + 40 * Math.cos(a + 0.58)} ${151 + 15 * Math.sin(a + 0.58)}`}
              />
            </g>
          )
        })}
        <ellipse cx="166" cy="151" rx="25" ry="11" />
        <path d="m153 145 13-4 13 4v11l-13 5-13-5z" />
      </g>
      <g className="wheel-lip">
        <ellipse cx="166" cy="223" rx="99" ry="37" />
        <ellipse cx="166" cy="223" rx="86" ry="29" />
        <path d="M67 223v8c0 21 44 37 99 37s99-16 99-37v-8" />
      </g>
      <path
        d="M46 60H17m29 91H17m29 72H17M293 59h20m-20 93h20m-20 71h20"
        className="diagram-guide"
      />
    </g>
  )
}

function Sword() {
  return (
    <g transform="translate(42 -5) rotate(27 120 138)">
      <path d="m122 19 22 50-12-5 20 32-14-4 17 35-16-4 9 29-21 27-10-12-12 12-22-27 9-29-15 4 17-35-14 4 20-32-12 5z" />
      <path
        d="m122 36 5 39-8 19 10 19-7 39m-13-72 8 14-13 16 9 18-11 20m32-53-8 13 14 25-9 20"
        className="diagram-fine"
      />
      <path d="m110 161-23-7-15-23-5 36 39 18m27-24 23-7 15-23 5 36-39 18" />
      <path d="m110 178 12-9 12 9-5 13h-14zm5 13-2 47 10 7 9-7-3-47M112 202l19 7m-19 3 19 7m-19 3 19 7m-20 9-9 10 21 13 19-13-11-10" />
      <path d="m122 176 5 6-5 6-5-6z" className="diagram-wash" />
      <path d="M51 20v236m-7-236h14m-14 236h14" className="diagram-guide" />
    </g>
  )
}

function Fishing() {
  return (
    <g>
      <path d="M25 208Q128 49 294 30M32 210Q137 58 294 30" />
      <path d="m24 207-12 22 9 6 15-24zm12-12 17-20 7 5-16 23z" />
      {[
        [69, 156, 6],
        [117, 108, 5],
        [169, 72, 4],
        [228, 44, 3],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} />
      ))}
      <path d="M72 159Q197 55 294 30q-6 83-33 88" className="diagram-fine" />
      <path d="m43 188 18 13 7-10m-17 5-6 20m-4-5 18 11 13-17-15-10z" />
      <ellipse cx="64" cy="204" rx="12" ry="9" transform="rotate(-40 64 204)" />
      <path d="M52 195q-9-27 13-22 23 5 5 26m0 13 14 12 7-6m-7 6 2 7" />
      <g transform="translate(174 116) rotate(-14)">
        <path d="M0 14Q34-8 66 10l12 10-18 12Q25 45 0 20zm0 0-15-9 4 17 11-2M62 15l20-4-2 10-17 1" />
        <circle cx="59" cy="17" r="3" />
        <path d="m24 33 0 15m-5-4q5 13 10 0m19-14v14m-5-4q5 12 10 0" />
        <path
          d="M9 18h37m-28-6 6 14m5-17 6 16m5-16 6 14"
          className="diagram-fine"
        />
      </g>
      <g transform="translate(94 178)">
        <path d="M0 39Q42-7 133 18l27 15 39-19-8 30 5 21-40-20Q70 85 0 48l-11-5z" />
        <path d="M63 13 85-5l23 19m12 44 16 16 9-24M32 25Q52 44 35 62m7-21 18 17-18-1m30 4 9 12 14-13M46 38q60-1 109 4" />
        <circle cx="21" cy="34" r="4" />
        <path d="M1 44h19m140-7 26-13m-26 16 28-5m-28 9 25 10" />
        {sequence(26).map((i) => (
          <circle
            key={i}
            cx={48 + ((i * 19) % 98)}
            cy={25 + ((i * 11) % 25)}
            r="1.3"
          />
        ))}
      </g>
    </g>
  )
}

const illustrations = {
  pi: PiBoard,
  camera: Camera,
  engine: Engine,
  drone: Drone,
  wheel: Wheel,
  sword: Sword,
  fishing: Fishing,
}

export default function EngineeringDiagram({ kind, className = '' }) {
  const Drawing = illustrations[kind]
  return (
    <svg
      className={`engineering-diagram ${className}`}
      viewBox="0 0 340 290"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Drawing />
    </svg>
  )
}
