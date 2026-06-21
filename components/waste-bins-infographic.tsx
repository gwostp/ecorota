export function WasteBinsInfographic() {
  return (
    <svg width="100%" viewBox="0 0 680 520" role="img" aria-label="Lixeiras da coleta seletiva">
      <title>Lixeiras da coleta seletiva</title>
      <desc>Infográfico das lixeiras coloridas da coleta seletiva com os tipos de resíduos de cada uma</desc>

      <text x="340" y="32" textAnchor="middle" fontSize="15" fontWeight="500" fill="currentColor">Lixeiras da coleta seletiva</text>
      <text x="340" y="52" textAnchor="middle" fontSize="12" fill="currentColor" opacity=".6">Separe corretamente antes do dia da coleta</text>

      {/* AZUL — Papel */}
      <rect x="30" y="100" width="86" height="110" rx="6" fill="#B5D4F4" stroke="#185FA5" strokeWidth="1.2"/>
      <rect x="24" y="88" width="98" height="18" rx="5" fill="#378ADD" stroke="#185FA5" strokeWidth="1.2"/>
      <rect x="60" y="80" width="26" height="12" rx="4" fill="none" stroke="#185FA5" strokeWidth="1.5"/>
      <ellipse cx="52" cy="212" rx="10" ry="6" fill="#0C447C" opacity=".7"/>
      <ellipse cx="94" cy="212" rx="10" ry="6" fill="#0C447C" opacity=".7"/>
      <circle cx="73" cy="142" r="18" fill="#185FA5"/>
      <text x="73" y="150" textAnchor="middle" fontSize="22" fill="white">♻</text>
      <text x="73" y="170" textAnchor="middle" fontSize="11" fill="#185FA5">Papel</text>
      <text x="73" y="238" textAnchor="middle" fontSize="12" fontWeight="500" fill="#185FA5">Papel / papelão</text>
      <text x="73" y="255" textAnchor="middle" fontSize="10" fill="#378ADD">Jornais, revistas</text>
      <text x="73" y="270" textAnchor="middle" fontSize="10" fill="#378ADD">Caixas limpas</text>

      {/* VERMELHA — Plástico */}
      <rect x="148" y="100" width="86" height="110" rx="6" fill="#F7C1C1" stroke="#A32D2D" strokeWidth="1.2"/>
      <rect x="142" y="88" width="98" height="18" rx="5" fill="#E24B4A" stroke="#A32D2D" strokeWidth="1.2"/>
      <rect x="178" y="80" width="26" height="12" rx="4" fill="none" stroke="#A32D2D" strokeWidth="1.5"/>
      <ellipse cx="170" cy="212" rx="10" ry="6" fill="#791F1F" opacity=".7"/>
      <ellipse cx="212" cy="212" rx="10" ry="6" fill="#791F1F" opacity=".7"/>
      <circle cx="191" cy="142" r="18" fill="#A32D2D"/>
      <text x="191" y="150" textAnchor="middle" fontSize="22" fill="white">♻</text>
      <text x="191" y="170" textAnchor="middle" fontSize="11" fill="#A32D2D">Plástico</text>
      <text x="191" y="238" textAnchor="middle" fontSize="12" fontWeight="500" fill="#A32D2D">Plásticos</text>
      <text x="191" y="255" textAnchor="middle" fontSize="10" fill="#E24B4A">Garrafas PET</text>
      <text x="191" y="270" textAnchor="middle" fontSize="10" fill="#E24B4A">Embalagens</text>

      {/* AMARELA — Metal */}
      <rect x="266" y="100" width="86" height="110" rx="6" fill="#FAC775" stroke="#854F0B" strokeWidth="1.2"/>
      <rect x="260" y="88" width="98" height="18" rx="5" fill="#EF9F27" stroke="#854F0B" strokeWidth="1.2"/>
      <rect x="296" y="80" width="26" height="12" rx="4" fill="none" stroke="#854F0B" strokeWidth="1.5"/>
      <ellipse cx="288" cy="212" rx="10" ry="6" fill="#633806" opacity=".7"/>
      <ellipse cx="330" cy="212" rx="10" ry="6" fill="#633806" opacity=".7"/>
      <circle cx="309" cy="142" r="18" fill="#854F0B"/>
      <text x="309" y="150" textAnchor="middle" fontSize="22" fill="white">♻</text>
      <text x="309" y="170" textAnchor="middle" fontSize="11" fill="#854F0B">Metal</text>
      <text x="309" y="238" textAnchor="middle" fontSize="12" fontWeight="500" fill="#854F0B">Metais</text>
      <text x="309" y="255" textAnchor="middle" fontSize="10" fill="#BA7517">Latas de alumínio</text>
      <text x="309" y="270" textAnchor="middle" fontSize="10" fill="#BA7517">Latinhas</text>

      {/* VERDE — Vidro */}
      <rect x="384" y="100" width="86" height="110" rx="6" fill="#C0DD97" stroke="#3B6D11" strokeWidth="1.2"/>
      <rect x="378" y="88" width="98" height="18" rx="5" fill="#639922" stroke="#3B6D11" strokeWidth="1.2"/>
      <rect x="414" y="80" width="26" height="12" rx="4" fill="none" stroke="#3B6D11" strokeWidth="1.5"/>
      <ellipse cx="406" cy="212" rx="10" ry="6" fill="#27500A" opacity=".7"/>
      <ellipse cx="448" cy="212" rx="10" ry="6" fill="#27500A" opacity=".7"/>
      <circle cx="427" cy="142" r="18" fill="#3B6D11"/>
      <text x="427" y="150" textAnchor="middle" fontSize="22" fill="white">♻</text>
      <text x="427" y="170" textAnchor="middle" fontSize="11" fill="#3B6D11">Vidro</text>
      <text x="427" y="238" textAnchor="middle" fontSize="12" fontWeight="500" fill="#3B6D11">Vidros</text>
      <text x="427" y="255" textAnchor="middle" fontSize="10" fill="#639922">Garrafas, potes</text>
      <text x="427" y="270" textAnchor="middle" fontSize="10" fill="#639922">Frascos limpos</text>

      {/* MARROM — Orgânico */}
      <rect x="496" y="88" width="98" height="18" rx="5" fill="#8B6344" stroke="#5F3D22" strokeWidth="1.2"/>
      <rect x="502" y="100" width="86" height="110" rx="6" fill="#C4A882" stroke="#7A5230" strokeWidth="1.2"/>
      <ellipse cx="524" cy="212" rx="10" ry="6" fill="#5F3D22" opacity=".7"/>
      <ellipse cx="566" cy="212" rx="10" ry="6" fill="#5F3D22" opacity=".7"/>
      <rect x="532" y="80" width="26" height="12" rx="4" fill="none" stroke="#7A5230" strokeWidth="1.5"/>
      <circle cx="545" cy="142" r="18" fill="#7A5230"/>
      <text x="545" y="150" textAnchor="middle" fontSize="22" fill="white">🌿</text>
      <text x="545" y="170" textAnchor="middle" fontSize="11" fill="#7A5230">Orgânico</text>
      <text x="545" y="238" textAnchor="middle" fontSize="12" fontWeight="500" fill="#7A5230">Orgânicos</text>
      <text x="545" y="255" textAnchor="middle" fontSize="10" fill="#8B6344">Restos de comida</text>
      <text x="545" y="270" textAnchor="middle" fontSize="10" fill="#8B6344">Cascas, folhas</text>

      {/* Separador */}
      <line x1="30" y1="290" x2="650" y2="290" stroke="#e5e7eb" strokeWidth="0.8"/>

      {/* Rejeito */}
      <rect x="30" y="308" width="620" height="60" rx="10" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.8"/>
      <text x="340" y="333" textAnchor="middle" fontSize="12" fontWeight="500" fill="#374151">🗑️  Rejeito (lixo comum) — saco preto</text>
      <text x="340" y="352" textAnchor="middle" fontSize="11" fill="#6b7280">Tudo que não é reciclável nem orgânico: isopor, papel higiênico, fraldas, cerâmica.</text>

      <text x="340" y="400" textAnchor="middle" fontSize="11" fill="#6b7280">Lave as embalagens antes de descartar · Não use sacos pretos para recicláveis</text>

      {/* Dica Joinville */}
      <rect x="100" y="420" width="480" height="76" rx="10" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.8"/>
      <text x="340" y="443" textAnchor="middle" fontSize="12" fontWeight="500" fill="#27500A">Em Joinville, separe pelo menos em 2 sacos:</text>
      <text x="340" y="463" textAnchor="middle" fontSize="11" fill="#3B6D11">Saco 1 — Recicláveis secos (azul, vermelho, amarelo, verde)</text>
      <text x="340" y="480" textAnchor="middle" fontSize="11" fill="#3B6D11">Saco 2 — Orgânicos / Rejeito em sacos separados</text>
    </svg>
  )
}
