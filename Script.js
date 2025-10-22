/* Script.js - منطق اللعبة */
/* Arabic comments to explain behavior */

/* بيانات فرق ومثال لاعبين حسب الـ position */
const teamsData = {
  "Liverpool": {
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Alisson Becker", "Kelleher"],
      "Defender": ["Virgil van Dijk", "Trent Alexander-Arnold"],
      "Midfielder": ["Jordan Henderson", "Fabinho"],
      "Forward": ["Mohamed Salah", "Diogo Jota"]
    }
  },
  "Barsenila": { // Barsenila = fictional spelling (مثال)
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Player B1"],
      "Defender": ["Player B2"],
      "Midfielder": ["Player B3"],
      "Forward": ["Player B4"]
    }
  },
  "Arsenal": {
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Aaron Ramsdale"],
      "Defender": ["Ben White", "Gabriel"],
      "Midfielder": ["Martin Ødegaard", "Declan Rice"],
      "Forward": ["Bukayo Saka", "Gabriel Jesus"]
    }
  },
  "Manchester City": {
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Ederson"],
      "Defender": ["Rúben Dias", "John Stones"],
      "Midfielder": ["Kevin De Bruyne", "Rodri"],
      "Forward": ["Erling Haaland", "Phil Foden"]
    }
  },
  "Real Madrid": {
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Thibaut Courtois"],
      "Defender": ["David Alaba", "Éder Militão"],
      "Midfielder": ["Toni Kroos", "Luka Modrić"],
      "Forward": ["Karim Benzema", "Vinícius Júnior"]
    }
  },
  "PSG": {
    positions: ["Goal", "Defender", "Midfielder", "Forward"],
    players: {
      "Goal": ["Gianluigi Donnarumma"],
      "Defender": ["Marquinhos", "Sergio Ramos"],
      "Midfielder": ["Marco Verratti"],
      "Forward": ["Kylian Mbappé", "Neymar"]
    }
  }
};

/* عناصر DOM */
const teamsRow = document.getElementById('teamsRow');
const teamElements = Array.from(document.querySelectorAll('.team'));
const selectedLogo = document.getElementById('selectedLogo');
const selectedPosition = document.getElementById('selectedPosition');
const innerLetter = document.getElementById('cyclingLetter');
const startBtn = document.getElementById('startBtn');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');

let letterInterval = null;
let countdownInterval = null;
let isRunning = false;

/* حركات النقر لاختيار فريق يدويًا (تأمين اختيار المستخدم) */
teamElements.forEach(el=>{
  el.addEventListener('click', ()=>{
    teamElements.forEach(t=>t.classList.remove('active'));
    el.classList.add('active');
    const team = el.dataset.team;
    setSelectedTeam(team);
  });
});

/* تعيين الفريق المختار في الأعلى */
function setSelectedTeam(teamName){
  selectedLogo.textContent = teamName;
  const pos = teamsData[teamName] ? teamsData[teamName].positions[0] : '—';
  selectedPosition.textContent = `Position: ${pos}`;
}

/* دالة لبدء اللعبة */
startBtn.addEventListener('click', startGame);

function startGame(){
  if(isRunning) return; // منع تكرار النقر
  isRunning = true;
  resultEl.textContent = 'اللاعب: —';
  timerEl.textContent = '15';

  // اختيار فريق عشوائي من القائمة
  const teamNames = Object.keys(teamsData);
  const randomTeam = teamNames[Math.floor(Math.random() * teamNames.length)];
  // إبراز الفريق في شريط اللوغوهات
  teamElements.forEach(t=> t.classList.toggle('active', t.dataset.team === randomTeam));
  setSelectedTeam(randomTeam);

  // اختيار position عشوائي من ذلك الفريق وعرضه تحت اللوغو
  const positions = teamsData[randomTeam].positions;
  const randomPosition = positions[Math.floor(Math.random() * positions.length)];
  selectedPosition.textContent = `Position: ${randomPosition}`;

  // دوران الحروف A..Z بسرعة ثم التوقف على حرف واحد
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  let idx = 0;
  innerLetter.textContent = letters[0];

  // مدة الدوران قبل التوقف (نضع بين 1300-2300 ms لتأثير حركي)
  const spinDuration = 1300 + Math.floor(Math.random()*1000);
  const spinStart = Date.now();

  letterInterval = setInterval(()=>{
    idx = (idx + 1) % letters.length;
    innerLetter.textContent = letters[idx];
    // توقف عشوائي بعد انتهاء المدة
    if(Date.now() - spinStart > spinDuration){
      clearInterval(letterInterval);
      // نجعل الحرف النهائي عشوائيًا بدلاً من الحرف الحالي
      const finalLetter = letters[Math.floor(Math.random()*letters.length)];
      innerLetter.textContent = finalLetter;
      // بعد توقف الحروف نبدأ العد التنازلي
      startCountdown(15, randomTeam, randomPosition);
    }
  }, 45); // سرعة التبديل بين الحروف (45ms يعطي حركة سريعة)

}

/* دالة بدء العد التنازلي */
function startCountdown(seconds, team, position){
  let remaining = seconds;
  timerEl.textContent = remaining;
  countdownInterval = setInterval(()=>{
    remaining--;
    timerEl.textContent = remaining;
    if(remaining <= 0){
      clearInterval(countdownInterval);
      revealPlayer(team, position);
      isRunning = false;
    }
  }, 1000);
}

/* اظهار اللاعب المناسب بعد انتهاء الوقت */
function revealPlayer(team, position){
  const teamInfo = teamsData[team];
  if(!teamInfo){ 
    resultEl.textContent = `اللاعب: غير متوفر`; 
    return; 
  }

  const players = teamInfo.players[position] || [];
  if(players.length === 0){
    resultEl.textContent = `اللاعب: لا يوجد لاعب معرف لهذا المنصب (${position})`;
    return;
  }

  // نجلب الحرف الظاهر في الدائرة
  const letter = innerLetter.textContent.toUpperCase();

  // نحاول إيجاد لاعب يبدأ بنفس الحرف
  const filtered = players.filter(p => p.toUpperCase().startsWith(letter));
  if(filtered.length > 0){
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    resultEl.textContent = `اللاعب: ${chosen} — (${position})`;
  } else {
    resultEl.textContent = `لا يوجد لاعب يبدأ بالحرف ${letter}`;
  }
}
