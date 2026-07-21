/* ============================================================
   📦 1. 데이터 저장소 (DATA 객체)
   - 만약 인터넷이 안 되거나 구글 시트에 연결을 실패했을 때,
     웹사이트가 텅 비지 않도록 보여줄 '비상용(예시) 데이터 창고'입니다.
   ============================================================ */
const DATA = {
  phrases: [
    { tab: "자주 사용하는 말", type: "phrase", korean: "[예시] 조심해", japanese: "気を付けて", reading: "키오츠케테", content: "" },
    { tab: "참고사항", type: "note", korean: "", japanese: "", reading: "", content: "[예시] 개인카페를 갈 때는 사진을 찍어도 되는지 확인 필요" },
  ],
  trip: {
    title: "일본 단기선교 가이드북",
    subtitle: "2026.08.04(화) ~ 08.12(수) · 8박 9일",
  },
  days: [
    // 💡 날짜가 바뀌면 여기 있는 글자들을 직접 수정해주시면 됩니다.
    { key: "day1", label: "1일차", date: "8/4(화)" },
    { key: "day2", label: "2일차", date: "8/5(수)" },
    { key: "day3", label: "3일차", date: "8/6(목)" },
    { key: "day4", label: "4일차", date: "8/7(금)" },
    { key: "day5", label: "5일차", date: "8/8(토)" },
    { key: "day6", label: "6일차", date: "8/9(일)" },
    { key: "day7", label: "7일차", date: "8/10(월)" },
    { key: "day8", label: "8일차", date: "8/11(화)" },
    { key: "day9", label: "9일차", date: "8/12(수)" },
  ],
  songs: {
    both: [{ title: "[예시] 주기도문 (한일 합본)", note: "한국어+일본어 병기" }],
    japan: [{ title: "[예시] きよしこの夜 (고요한 밤 거룩한 밤)", note: "Key G" }],
    korean: [{ title: "[예시] 주 은혜임을", note: "Key D" }],
  },
  devotion: {
    day1: { topic: "[예시] 도착감사예배", title: "[예시] 에베소서 2:1-10", verse: "[예시] 1너희의... (생략)", content: "[예시] 1) 묵상질문" },
    day2: null, day3: null, day4: null, day5: null, day6: null, day7: null, day8: null, day9: null, // 비어있는 날짜는 null(없음) 처리
  },
  scheduleOverview: {
    slots: ["8:00~9:00", "9:00~10:00", "10:00~11:00"],
    byDay: { day1: ["[예시] 일본 출발", "[예시] 일본 출발", "[예시] 일본 출발"], day2: ["", "", ""], day3: ["", "", ""], day4: ["", "", ""], day5: ["", "", ""], day6: ["", "", ""], day7: ["", "", ""], day8: ["", "", ""], day9: ["", "", ""] },
  },
  scheduleDaily: {
    day1: [{ time: "09:00", activity: "[예시] 인천공항 집결", place: "인천공항 3층", note: "여권 지참 필수" }],
    day2: [], day3: [], day4: [], day5: [], day6: [], day7: [], day8: [], day9: [],
  },
  prep: [
    { category: "출발전 공통", type: "", item: "[예시] 여권 (유효기간 6개월 이상)", note: "출발 최소 1주 전 확인", day: "" },
    { category: "무언극", type: "사역", item: "[예시] 무언극 소품 박스", note: "", day: "day3" },
    { category: "무언극", type: "개인", item: "[예시] 편한 운동복", note: "", day: "" },
    { category: "요리", type: "사역", item: "[예시] 조리도구 세트", note: "", day: "" },
    { category: "요리", type: "개인", item: "[예시] 앞치마", note: "", day: "" },
    { category: "캠프", type: "사역", item: "[예시] 게임 준비물", note: "", day: "" },
    { category: "캠프", type: "개인", item: "[예시] 운동화", note: "", day: "" },
  ],
  etc: [{ title: "[예시] 환전 안내", content: "[예시] 현지 통화 관련 참고 내용을 채워주세요." }],
  changes: [{ date: "8/4 09:10", tag: "일반", title: "[예시] 3일차 일정 변경", content: "[예시] 변경 내용을 여기에 적어주세요.", urgent: false }],
};

/* ============================================================
   🔗 2. 구글 시트 연동 설정 
   - 외부 창고(엑셀 시트)에서 데이터를 가져오기 위한 주소와 탭 이름 세팅
   ============================================================ */
const SHEET_ID = "1e-fYMtnsH_Z8fdBgo5kqwZUlab_QvftwzfP87UHCWTc"; // 시트의 고유 아이디 (주민번호 같은 역할)

const SHEET_TABS = {
  phrases: "Phrases", songs: "Songs", devotion: "Devotion",
  scheduleDaily: "ScheduleDaily", prep: "Prep", etc: "Etc", changes: "Changes",
};

// 💡 엑셀 시트의 데이터를 웹이 알아먹을 수 있는 배열 형태로 바꿔주는 기계(함수)입니다.
async function fetchSheetRows(tabName) {
  // 구글 시트 주소에 아이디와 탭 이름을 붙여서 텍스트로 달라고 요청(fetch)합니다.
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url); // 응답이 올 때까지 기다립니다 (await)
  const text = await res.text(); // 글자 형태로 변환합니다
  
  // 구글이 주는 데이터 형식이 복잡해서, 우리가 필요한 알맹이만 잘라냅니다.
  const jsonStr = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
  const json = JSON.parse(jsonStr);
  const cols = json.table.cols.map(c => (c.label || '').trim().toLowerCase()); // 엑셀의 맨 윗줄(제목행) 가져오기
  
  // 엑셀의 칸칸이 적힌 데이터를 자바스크립트 객체 형태로 예쁘게 묶어줍니다.
  return (json.table.rows || []).map(r => {
    const obj = {};
    cols.forEach((key, i) => {
      const cell = r.c[i];
      let val = '';
      if (cell) {
        if (cell.v !== null && cell.v !== undefined && cell.v !== '') val = String(cell.v);
        else if (cell.f !== null && cell.f !== undefined) val = String(cell.f); // 숫자와 문자가 섞였을 때 에러 방지
      }
      obj[key] = val;
    });
    return obj;
  });
}

// 엑셀에 TRUE, YES, 1 등으로 적힌 값을 컴퓨터가 아는 진짜 참/거짓으로 변환해줍니다.
function toBool(v) {
  return ['true', 'y', 'yes', '1', 'o'].includes(String(v).trim().toLowerCase());
}

// 💡 모든 탭의 엑셀 데이터를 동시에 다 가져와서 위의 DATA 창고(비상용 데이터)에 덮어씌웁니다.
async function loadFromSheets() {
  // 7개의 탭 데이터를 동시에 주문(Promise.all)해서 택배 7개를 한 번에 받습니다. (속도가 빠름)
  const [phrases, songs, devotion, schedDaily, prep, etc, changes] = await Promise.all([
    fetchSheetRows(SHEET_TABS.phrases), fetchSheetRows(SHEET_TABS.songs), fetchSheetRows(SHEET_TABS.devotion),
    fetchSheetRows(SHEET_TABS.scheduleDaily), fetchSheetRows(SHEET_TABS.prep), fetchSheetRows(SHEET_TABS.etc), fetchSheetRows(SHEET_TABS.changes),
  ]);

  // 택배 상자(엑셀 데이터)를 뜯어서 DATA 창고에 카테고리별로 알맞게 정리해 넣습니다.
  DATA.phrases = phrases.filter(r => r.korean || r.japanese || r.content).map(r => ({
    tab: r.tab || '자주 사용하는 말',
    type: (r.type || '').toLowerCase().startsWith('note') ? 'note' : 'phrase',
    korean: r.korean || '', japanese: r.japanese || '', reading: r.reading || '', content: r.content || '',
  }));

  DATA.songs = { both: [], japan: [], korean: [] };
  songs.forEach(row => {
    const cat = (row.category || '').toLowerCase();
    let group = 'both';
    if (cat.startsWith('jap')) group = 'japan';
    else if (cat.startsWith('kor')) group = 'korean';
    if (row.title) DATA.songs[group].push({ title: row.title, note: row.note || '', link: row.link || '' });
  });

  DATA.devotion = {};
  DATA.days.forEach(d => DATA.devotion[d.key] = null); // 초기엔 다 비워두기
  devotion.forEach(row => {
    if (row.day) DATA.devotion[row.day] = { topic: row.topic || '', title: row.title, verse: row.verse, content: row.content };
  });

  const dayKeys = DATA.days.map(d => d.key);
  DATA.scheduleDaily = {};
  DATA.days.forEach(d => DATA.scheduleDaily[d.key] = []);
  schedDaily.forEach(row => {
    if (row.day && DATA.scheduleDaily[row.day]) {
      DATA.scheduleDaily[row.day].push({ time: row.time || '', activity: row.activity || '', place: row.place || '', note: row.note || '' });
    }
  });

  // 일자별 시간표(scheduleDaily)를 분석해서 '전체 일정표' 표(table) 데이터를 자동으로 만들어줍니다.
  DATA.scheduleOverview = buildOverviewFromDaily(DATA.scheduleDaily, dayKeys);

  DATA.prep = prep.filter(r => r.item).map(r => ({
    category: r.category || '기타', type: r.type || '', item: r.item, note: r.note || '', day: r.day || '',
  }));

  DATA.etc = etc.filter(r => r.title).map(r => ({ title: r.title, content: r.content || '' }));

  DATA.changes = changes.filter(r => r.title).map(r => ({
    date: r.date || '', tag: r.tag || '일반', title: r.title, content: r.content || '', urgent: toBool(r.urgent),
  }));
}

/* ============================================================
   🎨 3. 화면 렌더링 함수들 (붓질하는 화가 역할)
   - 데이터 창고(DATA)에서 정보를 꺼내와서 HTML 껍데기에 글씨를 찍어줍니다.
   ============================================================ */

// 헤더의 글씨 바꿔주기
document.getElementById('tripTitle').textContent = DATA.trip.title;
document.getElementById('tripSubtitle').textContent = DATA.trip.subtitle;

// 몇 일차인지 이름 반환해주는 헬퍼 함수
function dayLabel(key) {
  const d = DATA.days.find(d => d.key === key);
  return d ? `${d.label} (${d.date})` : key;
}

// 텅 빈 데이터일 때 보여줄 '텅 빔 상자' 디자인 조립기
function emptyState(msg) { return `<div class="empty-state">${msg}</div>`; }

// 해커들이 이상한 스크립트를 적었을 때 공격받지 않도록 특수기호를 글자로 변환하는 방어막 함수
function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* 0) 도움되는 것 화면 그리기 */
function renderPhrases() {
  const tabsEl = document.getElementById('phraseTabs'); // 탭 메뉴가 들어갈 빈 껍데기 상자를 찾습니다
  const list = DATA.phrases || [];
  const tabNames = [];
  list.forEach(p => { if (p.tab && !tabNames.includes(p.tab)) tabNames.push(p.tab); });
  if (tabNames.length === 0) tabNames.push('자주 사용하는 말');
  
  // 탭 버튼들을 만들어 껍데기 상자 안(innerHTML)에 쑤셔 넣습니다
  tabsEl.innerHTML = tabNames.map((t, i) => `<button class="sub-tab ${i === 0 ? 'active' : ''}" data-tab="${escapeHtml(t)}" onclick="showPhraseTab(this)">${t}</button>`).join('');
  showPhraseTab(tabsEl.querySelector('.sub-tab')); // 첫 번째 탭 클릭해두기
}
// 특정 탭을 누르면 안의 내용물을 바꿔치기 하는 함수
function showPhraseTab(btn) {
  document.querySelectorAll('#phraseTabs .sub-tab').forEach(t => t.classList.remove('active')); // 다른 탭 색깔 끄기
  btn.classList.add('active'); // 누른 탭 색깔 켜기
  const tabName = btn.dataset.tab;
  const contentEl = document.getElementById('phraseContent'); // 내용이 들어갈 큰 박스
  const items = (DATA.phrases || []).filter(p => (p.tab || '자주 사용하는 말') === tabName);
  
  if (items.length === 0) { contentEl.innerHTML = emptyState('아직 등록된 내용이 없습니다.'); return; }
  
  // 카드(HTML 조각)들을 만들어서 박스 안에 붙여 넣습니다.
  contentEl.innerHTML = items.map(p => {
    if (p.type === 'note') return `<div class="note-item">${escapeHtml(p.content)}</div>`;
    return `
    <div class="phrase-item">
      <div class="phrase-kr">${escapeHtml(p.korean)}</div>
      <div class="phrase-jp-row">
        <span class="phrase-jp">${escapeHtml(p.japanese)}</span>
        <span class="phrase-reading">${escapeHtml(p.reading)}</span>
        <button class="speak-btn" data-jp="${escapeHtml(p.japanese)}" onclick="speakJapanese(this)" title="일본어 발음 듣기">🔊</button>
      </div>
    </div>`;
  }).join('');
}
// 웹 브라우저 내장 기능을 이용해 일본어를 스피커로 읽어주는 신기한 함수입니다.
function speakJapanese(btn) {
  const text = btn.dataset.jp;
  if (!text) return;
  if (!('speechSynthesis' in window)) { alert('이 브라우저는 음성 재생 기능을 지원하지 않습니다.'); return; }
  window.speechSynthesis.cancel(); // 말하던 게 있으면 멈춤
  const utter = new SpeechSynthesisUtterance(text); // 대본 작성
  utter.lang = 'ja-JP'; // 언어는 일본어
  utter.rate = 1.1; // 조금 빠르게 1.1배속
  window.speechSynthesis.speak(utter); // 읽어라!
}

/* 1) 찬양 악보 화면 그리기 */
function renderSongs() {
  const tabsEl = document.getElementById('songTabs');
  const groups = [ { key: 'both', label: '한일 통합' }, { key: 'japan', label: '일본어 찬양' }, { key: 'korean', label: '한국어 찬양' } ];
  tabsEl.innerHTML = groups.map((g, i) => `<button class="sub-tab ${i === 0 ? 'active' : ''}" data-key="${g.key}" onclick="showSongGroup('${g.key}', this)">${g.label}</button>`).join('');
  showSongGroup(groups[0].key, tabsEl.querySelector('.sub-tab'));
}
function renderSongList(list) {
  return list.map((s, i) => {
    const preview = s.link ? buildScorePreview(s.link) : ''; // 링크가 있으면 악보 미리보기를 만듭니다
    return `
    <div class="song-item-wrap">
      <div class="song-item">
        <span class="song-num">${i + 1}</span>
        <span class="song-title">${s.title}</span>
        ${s.note ? `<span class="song-note">${s.note}</span>` : ''}
      </div>
      ${preview ? `<div class="score-preview">${preview}</div>` : ''}
    </div>`;
  }).join('');
}
function showSongGroup(key, btn) {
  document.querySelectorAll('#songTabs .sub-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const contentEl = document.getElementById('songContent');
  const list = DATA.songs[key] || [];
  if (list.length === 0) { contentEl.innerHTML = emptyState('아직 등록된 악보가 없습니다.'); return; }
  contentEl.innerHTML = renderSongList(list);
}
// 구글 드라이브 링크가 들어왔을 때, 드라이브 안의 파일 고유 아이디만 뽑아내는 함수
function extractDriveId(url) {
  if (!url) return null;
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}
// 구글 드라이브 파일 아이디를 이용해 웹 화면에 이미지를 바로 띄워주는 HTML 태그를 만듭니다
function buildScorePreview(link) {
  const driveId = extractDriveId(link);
  if (driveId) {
    return `<img src="https://drive.google.com/uc?export=view&id=${driveId}" loading="lazy" onerror="this.outerHTML='<iframe src=\\'https://drive.google.com/file/d/${driveId}/preview\\' style=\\'height:420px;\\' loading=\\'lazy\\'></iframe>'">`;
  }
  if (/\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(link)) { return `<img src="${link}" loading="lazy">`; }
  return `<iframe src="${link}" style="height:420px;" loading="lazy"></iframe>`;
}

/* 2) 말씀 묵상 화면 그리기 */
function renderDevotionTabs() {
  const tabsEl = document.getElementById('devotionDayTabs');
  tabsEl.innerHTML = DATA.days.map((d, i) => `<button class="day-tab ${i === 0 ? 'active' : ''}" data-key="${d.key}" onclick="showDevotion('${d.key}', this)">${d.label}<span class="day-tab-date">${d.date}</span></button>`).join('');
  showDevotion(DATA.days[0].key, tabsEl.querySelector('.day-tab'));
}
// 성경 구절이 들어왔을 때, 절 번호(숫자)를 기준으로 예쁘게 엔터를 쳐주는 역할입니다.
function formatVerseLines(verseText) {
  if (!verseText) return '';
  let lines;
  if (verseText.includes('\n')) { lines = verseText.split('\n'); } else { lines = verseText.split(/(?=\d+)/); }
  lines = lines.map(l => l.trim()).filter(Boolean);
  return lines.map(l => `<p class="verse-line">${escapeHtml(l)}</p>`).join('');
}
// 묵상 질문 아래에 답변을 적을 수 있는 입력창을 만들어주는 함수입니다.
function renderDevotionQuestions(dayKey, contentText) {
  if (!contentText) return '';
  const lines = contentText.split('\n').map(s => s.trim()).filter(Boolean);
  if (!lines.length) return '';
  return `
    <div class="devo-questions">
      <p class="devo-questions-label">묵상 질문 &amp; 나의 답</p>
      ${lines.map((line, i) => {
        const storageKey = `devoAnswer_${dayKey}_${i}`;
        // 이전에 내 폰(localStorage)에 적어둔 답변이 있다면 몰래 가져옵니다
        const saved = localStorage.getItem(storageKey) || ''; 
        return `
          <div class="devo-question">
            <p class="devo-question-text">${escapeHtml(line)}</p>
            <textarea class="devo-answer-input" data-key="${storageKey}" placeholder="이곳에 나의 생각을 적어보세요">${escapeHtml(saved)}</textarea>
            <div class="devo-answer-actions">
              <button class="devo-save-btn" onclick="saveDevotionAnswer(this)">저장</button>
              <span class="devo-save-status"></span>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}
// 묵상 답변 저장 버튼을 누르면 브라우저의 은밀한 개인 공간(localStorage)에 저장해둡니다.
function saveDevotionAnswer(btn) {
  const wrap = btn.closest('.devo-question');
  const textarea = wrap.querySelector('.devo-answer-input');
  const status = wrap.querySelector('.devo-save-status');
  localStorage.setItem(textarea.dataset.key, textarea.value);
  status.textContent = '저장됨 ✓';
  setTimeout(() => { status.textContent = ''; }, 2000); // 2초 뒤에 글씨 사라지게 함
}
function showDevotion(key, btn) {
  document.querySelectorAll('#devotionDayTabs .day-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const d = DATA.devotion[key];
  const contentEl = document.getElementById('devotionContent');
  if (!d) { contentEl.innerHTML = emptyState(`${dayLabel(key)} 묵상 내용이 아직 등록되지 않았습니다.`); return; }
  contentEl.innerHTML = `
    <div class="card">
      ${d.topic ? `<p class="devo-topic">${escapeHtml(d.topic)}</p>` : ''}
      <p class="card-title">${escapeHtml(d.title)}</p>
      <div class="devo-verse">${formatVerseLines(d.verse)}</div>
      ${renderDevotionQuestions(key, d.content)}
    </div>`;
}

/* 3) 일정 관련 복잡한 로직들 (시간 계산, 현재 진행중인 일정 강조 기능 등) */
let scheduleTestNow = null; // 개발자 테스트 모드일 때 가짜 시간을 담는 변수
function parseScheduleTestDateTime(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}
function getScheduleReferenceNow() { return scheduleTestNow ? new Date(scheduleTestNow.getTime()) : new Date(); }
function formatScheduleReferenceTime(date) {
  return date.toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
}
function updateScheduleTimeStatus() {
  const statusEl = document.getElementById('scheduleTimeStatus');
  if (!statusEl) return;
  if (!scheduleTestNow) {
    statusEl.classList.remove('testing');
    statusEl.textContent = '실시간 기준 · 현재 기기 시각으로 일정이 강조됩니다.';
    return;
  }
  const referenceKey = getTodayDayKey(scheduleTestNow);
  statusEl.classList.add('testing');
  statusEl.textContent = referenceKey
    ? `테스트 기준 · ${formatScheduleReferenceTime(scheduleTestNow)} · ${dayLabel(referenceKey)}`
    : `테스트 기준 · ${formatScheduleReferenceTime(scheduleTestNow)} · 선교 일정 기간 밖`;
}
function selectScheduleReferenceDay(referenceNow, scrollToCurrent = true) {
  const key = getTodayDayKey(referenceNow);
  if (!key) { refreshCurrentScheduleHighlight(); return; }
  const btn = document.querySelector(`#scheduleDayTabs .day-tab[data-key="${key}"]`);
  if (!btn) return;
  showScheduleDay(key, btn);
  btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  if (scrollToCurrent) { requestAnimationFrame(() => { document.querySelector('#scheduleContent .sched-item.current')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }); }
}
function applyScheduleTestDateTime(value) {
  scheduleTestNow = parseScheduleTestDateTime(value);
  updateScheduleTimeStatus();
  selectScheduleReferenceDay(getScheduleReferenceNow());
}
function clearScheduleTestDateTime() {
  scheduleTestNow = null;
  const input = document.getElementById('scheduleTestDateTime');
  if (input) input.value = '';
  updateScheduleTimeStatus();
  selectScheduleReferenceDay(getScheduleReferenceNow());
}
function switchScheduleView(btn) {
  document.querySelectorAll('#page-schedule > .sub-tabs .sub-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#page-schedule .sub-page').forEach(p => p.classList.remove('active'));
  document.getElementById(btn.dataset.target).classList.add('active');
  if (btn.dataset.target === 'sched-daily') {
    refreshCurrentScheduleHighlight();
    requestAnimationFrame(() => { document.querySelector('#scheduleContent .sched-item.current')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
  }
}
// 일자별 시간표 배열을 분석해서 가로로 넓은 엑셀 모양의 전체 일정표 데이터를 생성해내는 알고리즘입니다.
function buildOverviewFromDaily(scheduleDaily, dayKeys) {
  let minHour = 8, maxHour = 23; 
  let found = false;
  dayKeys.forEach(k => {
    (scheduleDaily[k] || []).forEach(item => {
      const mins = parseClockMinutes(item.time);
      if (mins === null) return;
      const hour = Math.floor(mins / 60);
      if (!found || hour < minHour) minHour = hour;
      if (!found || hour + 1 > maxHour) maxHour = hour + 1;
      found = true;
    });
  });
  if (!found) return { slots: [], byDay: {} };
  const slots = [];
  for (let h = minHour; h < maxHour; h++) slots.push(`${h}:00~${h + 1}:00`); // 1시간 단위 슬롯 만들기
  const byDay = {};
  dayKeys.forEach(k => {
    const items = (scheduleDaily[k] || [])
      .map(item => ({ activity: item.activity, mins: parseClockMinutes(item.time) }))
      .filter(item => item.mins !== null)
      .sort((a, b) => a.mins - b.mins);
    byDay[k] = slots.map((_, i) => {
      const slotStart = (minHour + i) * 60;
      let current = '';
      items.forEach(item => { if (item.mins <= slotStart) current = item.activity; });
      return current;
    });
  });
  return { slots, byDay };
}
// 전체 일정표에서 같은 활동이 연속되면, 한 칸으로 합쳐주는(rowspan) 기능입니다.
function collapseColumn(values) {
  const result = new Array(values.length).fill(null);
  let i = 0;
  while (i < values.length) {
    let j = i;
    while (j + 1 < values.length && values[i] !== '' && values[j + 1] === values[i]) j++;
    result[i] = { text: values[i] || '', span: j - i + 1 };
    i = j + 1;
  }
  return result;
}
function renderOverviewTable() {
  const wrap = document.getElementById('overviewTableWrap');
  const grid = DATA.scheduleOverview;
  if (!grid || !grid.slots || grid.slots.length === 0) { wrap.innerHTML = emptyState('아직 등록된 일정계획표가 없습니다.'); return; }
  const dayKeys = DATA.days.map(d => d.key);
  const collapsed = {};
  dayKeys.forEach(k => collapsed[k] = collapseColumn(grid.byDay[k] || []));
  const headerHtml = `<th style="width:56px;">시간</th>` + DATA.days.map(d => `<th>${d.date}</th>`).join('');
  let bodyHtml = '';
  grid.slots.forEach((slot, rowIdx) => {
    let rowHtml = `<td>${escapeHtml(slot)}</td>`;
    dayKeys.forEach(k => {
      const seg = collapsed[k][rowIdx];
      if (seg === null) return; 
      const rowspanAttr = seg.span > 1 ? ` rowspan="${seg.span}"` : '';
      rowHtml += `<td${rowspanAttr}>${escapeHtml(seg.text || '')}</td>`;
    });
    bodyHtml += `<tr>${rowHtml}</tr>`;
  });
  wrap.innerHTML = `<div class="overview-scroll"><table class="overview-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}
// 현재 컴퓨터(핸드폰)의 연도와 오늘 날짜를 구해서 일정과 비교하는 함수입니다.
function getTripYear() {
  const match = String(DATA.trip.subtitle || '').match(/(20\d{2})/);
  return match ? Number(match[1]) : new Date().getFullYear();
}
function getDateForDay(day) {
  const match = String(day.date || '').match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  if (!match) return null;
  return new Date(getTripYear(), Number(match[1]) - 1, Number(match[2]));
}
function getTodayDayKey(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const found = DATA.days.find(day => {
    const date = getDateForDay(day);
    return date && date.getTime() === today;
  });
  return found ? found.key : null;
}
// 08:30 같은 시간을 컴퓨터가 계산하기 쉽게 분 단위(예: 510분)로 쪼개는 함수
function parseClockMinutes(text) {
  const match = String(text || '').match(/(\d{1,2})(?:\s*:\s*(\d{1,2}))?/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  if (hour > 24 || minute > 59) return null;
  return Math.min(hour * 60 + minute, 1440);
}
// 이 일정이 언제부터 언제까지인지 계산합니다.
function getScheduleRange(timeText, nextTimeText) {
  const raw = String(timeText || '').trim();
  if (/all\s*day|종일|하루\s*종일/i.test(raw)) return { start: 0, end: 1440 };
  const normalized = raw.replace(/[-～〜–—−－]/g, '~');
  const parts = normalized.split('~');
  const start = parseClockMinutes(parts[0]);
  if (start === null) return null;
  if (parts.length > 1) {
    const explicitEnd = parseClockMinutes(parts.slice(1).join('~'));
    return { start, end: explicitEnd === null ? 1440 : explicitEnd };
  }
  const nextStart = parseClockMinutes(nextTimeText);
  return { start, end: nextStart !== null && nextStart > start ? nextStart : Math.min(start + 60, 1440) };
}
// "이 일정이 지금 현재 진행 중인 시간대인가?"를 참/거짓으로 판별하는 함수
function isCurrentScheduleItem(key, item, index, list, now = getScheduleReferenceNow()) {
  if (key !== getTodayDayKey(now)) return false;
  const range = getScheduleRange(item.time, list[index + 1]?.time || '');
  if (!range) return false;
  let current = now.getHours() * 60 + now.getMinutes();
  let end = range.end;
  if (end <= range.start) {
    end += 1440;
    if (current < range.start) current += 1440;
  }
  return current >= range.start && current < end;
}
function renderScheduleDayTabs() {
  const tabsEl = document.getElementById('scheduleDayTabs');
  const referenceNow = getScheduleReferenceNow();
  const referenceKey = getTodayDayKey(referenceNow);
  const initialKey = referenceKey || DATA.days[0].key;
  tabsEl.innerHTML = DATA.days.map(d => {
    const classes = ['day-tab'];
    if (d.key === initialKey) classes.push('active');
    if (d.key === referenceKey) classes.push('today');
    return `<button class="${classes.join(' ')}" data-key="${d.key}" onclick="showScheduleDay('${d.key}', this)">${d.label}<span class="day-tab-date">${d.date}</span></button>`;
  }).join('');
  const initialBtn = tabsEl.querySelector(`[data-key="${initialKey}"]`);
  showScheduleDay(initialKey, initialBtn);
  initialBtn?.scrollIntoView({ inline: 'center', block: 'nearest' });
  updateScheduleTimeStatus();
}
function showScheduleDay(key, btn) {
  document.querySelectorAll('#scheduleDayTabs .day-tab').forEach(t => t.classList.remove('active'));
  btn?.classList.add('active');
  const list = DATA.scheduleDaily[key] || [];
  const contentEl = document.getElementById('scheduleContent');
  if (list.length === 0) { contentEl.innerHTML = emptyState(`${dayLabel(key)} 시간표가 아직 등록되지 않았습니다.`); return; }
  const referenceNow = getScheduleReferenceNow();
  const badgeText = scheduleTestNow ? '선택 시간' : '지금';
  
  // 지금 진행중인 일정(isCurrent)이면 배경색을 진하게 칠하는 CSS 클래스(current)를 추가해줍니다.
  contentEl.innerHTML = list.map((item, index) => {
    const isCurrent = isCurrentScheduleItem(key, item, index, list, referenceNow);
    return `
    <div class="sched-item ${isCurrent ? 'current' : ''}">
      <span class="sched-time">${escapeHtml(item.time)}</span>
      <div class="sched-body">
        <p class="sched-activity">${escapeHtml(item.activity)}${isCurrent ? `<span class="sched-current-badge">${badgeText}</span>` : ''}</p>
        ${item.place ? `<div class="sched-place">📍 ${escapeHtml(item.place)}</div>` : ''}
        ${item.note ? `<div class="sched-note">⚠ ${escapeHtml(item.note)}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}
// 시간이 지남에 따라 '현재 진행중'인 일정을 갱신해주는 함수
function refreshCurrentScheduleHighlight() {
  const referenceNow = getScheduleReferenceNow();
  const referenceKey = getTodayDayKey(referenceNow);
  document.querySelectorAll('#scheduleDayTabs .day-tab').forEach(tab => {
    tab.classList.toggle('today', tab.dataset.key === referenceKey);
  });
  const activeBtn = document.querySelector('#scheduleDayTabs .day-tab.active');
  if (activeBtn) showScheduleDay(activeBtn.dataset.key, activeBtn);
  updateScheduleTimeStatus();
}

/* 4) 준비물 화면 그리기 */
function switchPrepView(btn) {
  document.querySelectorAll('#page-prep > .sub-tabs .sub-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#page-prep .sub-page').forEach(p => p.classList.remove('active'));
  document.getElementById(btn.dataset.target).classList.add('active');
}
// 준비물을 팀 물건과 내 물건으로 분류합니다
function classifyPrepItems(items) {
  return {
    work: items.filter(p => p.type === '사역'),
    personal: items.filter(p => p.type === '개인'),
    common: items.filter(p => p.type !== '사역' && p.type !== '개인'),
  };
}
function renderChecklist(items) {
  return `<ul class="checklist">` + items.map(p => `
    <li><div><div>${escapeHtml(p.item)}</div>${p.note ? `<span class="item-note">${escapeHtml(p.note)}</span>` : ''}</div></li>
  `).join('') + `</ul>`;
}
function renderPrepSections(items) {
  const { work, personal, common } = classifyPrepItems(items);
  if (items.length === 0) return emptyState('등록된 준비물이 없습니다.');
  let html = '';
  if (common.length) html += renderChecklist(common);
  if (work.length) html += `<div class="section-label">📦 사역 물품 (단체)</div>${renderChecklist(work)}`;
  if (personal.length) html += `<div class="section-label">🎒 개인 물품</div>${renderChecklist(personal)}`;
  return html;
}
function renderPrepCategoryTabs() {
  const tabsEl = document.getElementById('prepCategoryTabs');
  const cats = [];
  (DATA.prep || []).forEach(p => { const c = p.category || '기타'; if (!cats.includes(c)) cats.push(c); });
  if (cats.length === 0) cats.push('출발전 공통');
  tabsEl.innerHTML = cats.map((c, i) => `<button class="sub-tab ${i === 0 ? 'active' : ''}" data-cat="${escapeHtml(c)}" onclick="showPrepCategory(this)">${c}</button>`).join('');
  showPrepCategory(tabsEl.querySelector('.sub-tab'));
}
function showPrepCategory(btn) {
  document.querySelectorAll('#prepCategoryTabs .sub-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.cat;
  const items = (DATA.prep || []).filter(p => (p.category || '기타') === cat);
  document.getElementById('prepCategoryContent').innerHTML = renderPrepSections(items);
}
function renderPrepDayTabs() {
  const tabsEl = document.getElementById('prepDayTabs');
  tabsEl.innerHTML = DATA.days.map((d, i) => `<button class="day-tab ${i === 0 ? 'active' : ''}" data-key="${d.key}" onclick="showPrepDay('${d.key}', this)">${d.label}<span class="day-tab-date">${d.date}</span></button>`).join('');
  showPrepDay(DATA.days[0].key, tabsEl.querySelector('.day-tab'));
}
function showPrepDay(key, btn) {
  document.querySelectorAll('#prepDayTabs .day-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const items = (DATA.prep || []).filter(p => (p.day || '').split(',').map(d => d.trim()).includes(key));
  const contentEl = document.getElementById('prepDailyContent');
  contentEl.innerHTML = items.length ? renderPrepSections(items) : emptyState(`${dayLabel(key)} 준비물이 아직 등록되지 않았습니다.`);
}

/* 5) 기타 내용 화면 그리기 */
function renderEtc() {
  const el = document.getElementById('etcContent');
  if (DATA.etc.length === 0) { el.innerHTML = emptyState('등록된 내용이 없습니다.'); return; }
  el.innerHTML = DATA.etc.map(e => `
    <div class="card">
      <p class="card-title">${escapeHtml(e.title)}</p>
      <p class="card-body">${escapeHtml(e.content)}</p>
    </div>
  `).join('');
}

/* 6) 변경사항 화면 그리기 */
function renderChanges() {
  const el = document.getElementById('changesContent');
  if (DATA.changes.length === 0) { el.innerHTML = emptyState('아직 변경사항이 없습니다.'); return; }
  el.innerHTML = DATA.changes.map((c, i) => `
    <div class="change-item ${c.urgent ? 'is-urgent' : (i === 0 ? 'is-new' : '')}">
      <div class="change-meta">
        <span class="change-date">${c.date}</span>
        <span class="change-tag ${c.urgent ? 'urgent' : (i === 0 ? 'new' : '')}">${c.urgent ? '긴급' : (i === 0 ? '최신' : c.tag)}</span>
      </div>
      <p class="change-title">${escapeHtml(c.title)}</p>
      <p class="change-body">${escapeHtml(c.content)}</p>
    </div>
  `).join('');
}

/* ============================================================
   🌟 7) ✍️ 개인 메모 기능 
   - 구글 시트가 아닌 사용자 본인의 핸드폰(로컬 스토리지)에 몰래 저장하는 기능
   ============================================================ */

// 사용자가 적은 글씨를 서랍(localStorage)에 넣는 함수
function saveMyMemo() {
  const input = document.getElementById('myMemoInput'); // 텍스트 입력창 상자 가져오기
  const text = input.value.trim(); // 적은 내용 가져오기 (공백 제거)
  
  if (!text) { alert('메모 내용을 입력해주세요.'); return; } // 내용이 없으면 경고창 띄우기

  // 1. 내 서랍(localStorage)에 저장된 기존 메모들을 몽땅 꺼내옵니다. 없으면 빈 서랍([])으로 시작.
  let memos = JSON.parse(localStorage.getItem('myMemos') || '[]');
  
  // 2. 지금 메모를 적은 현재 날짜와 시간 구하기
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR') + ' ' + now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  
  // 3. 꺼내온 메모 목록 맨 앞(unshift)에 새 메모를 슬쩍 끼워넣습니다. id는 삭제할 때 구분하려고 시간 숫자를 씁니다.
  memos.unshift({ id: Date.now(), text: text, date: dateStr });
  
  // 4. 새 메모가 들어간 목록을 다시 서랍 안에 덮어씌워서 잠급니다. (저장 완료)
  localStorage.setItem('myMemos', JSON.stringify(memos));
  
  input.value = ''; // 작성 다 했으니 입력창 비워주기
  renderMyMemos(); // 화면에 최신 메모 새로 그려주기
}

// 서랍(localStorage)에서 메모를 꺼내와서 화면에 카드 형태로 보여주는 함수
function renderMyMemos() {
  const listEl = document.getElementById('myMemoList');
  const memos = JSON.parse(localStorage.getItem('myMemos') || '[]');
  
  if (memos.length === 0) {
    listEl.innerHTML = emptyState('작성된 개인 메모가 없습니다.');
    return;
  }
  
  listEl.innerHTML = memos.map(memo => `
    <div class="my-memo-item">
      <button class="my-memo-delete" onclick="deleteMyMemo(${memo.id})">삭제</button>
      <div class="my-memo-date">${memo.date}</div>
      <div class="my-memo-text">${escapeHtml(memo.text)}</div>
    </div>
  `).join('');
}

// 특정 메모를 지우는 함수
function deleteMyMemo(id) {
  if (!confirm('이 메모를 삭제하시겠습니까?')) return; // 한 번 물어봄
  
  let memos = JSON.parse(localStorage.getItem('myMemos') || '[]');
  // filter: 휴지통 아이콘 누른 녀석의 id와 '일치하지 않는' 애들만 남겨서 배열을 다시 만듭니다. (즉, 걔만 삭제됨)
  memos = memos.filter(memo => memo.id !== id); 
  localStorage.setItem('myMemos', JSON.stringify(memos)); // 삭제된 배열을 다시 서랍에 저장
  renderMyMemos(); // 바뀐 목록으로 화면 다시 그리기
}

/* ============================================================
   🚀 네비게이션(화면 이동) 및 시작(Init) 관련 함수
   ============================================================ */

// 메인 메뉴 버튼 누를 때마다 화면 껍데기를 바꿔치기 해주는 함수
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); // 전부 안 보이게 끄고
  document.getElementById(pageId).classList.add('active'); // 내가 누른 놈만 켭니다
  window.scrollTo({ top: 0, behavior: 'auto' }); // 스크롤 맨 위로 올려줌
}
// 홈 화면으로 돌아가기 함수
function goHome() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// 데이터 준비가 끝나면 모든 화면을 한 번에 다 그려버리는 사령관 함수
function renderAll() {
  renderPhrases(); renderSongs(); renderDevotionTabs(); renderOverviewTable();
  renderScheduleDayTabs(); renderPrepCategoryTabs(); renderPrepDayTabs();
  renderEtc(); renderChanges(); renderMyMemos();
}

// 웹사이트에 처음 딱! 들어왔을 때 실행되는 최초 실행 함수
async function init() {
  const statusEl = document.getElementById('loadStatus');
  if (SHEET_ID === "여기에_구글시트_ID_붙여넣기") {
    statusEl.textContent = "⚠ 구글 시트가 연결되지 않아 예시 데이터로 표시 중입니다.";
    renderAll();
    return;
  }
  try {
    // 1. 구글 시트 택배를 기다립니다 (비동기 처리)
    await loadFromSheets(); 
    statusEl.textContent = "✅ 최신 정보로 업데이트되었습니다 · " + new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    renderAll(); // 2. 택배가 잘 오면 예쁘게 그립니다.
  } catch (e) {
    // 인터넷이 끊겼거나 시트 주소가 틀렸을 때 에러(e) 발생 처리
    console.error('구글 시트 로딩 실패:', e); 
    statusEl.textContent = "⚠ 최신 정보를 불러오지 못했습니다. 기존 내용으로 표시합니다.";
    renderAll(); // 2. 실패하더라도 위에서 만들어둔 비상용 데이터로 화면을 그립니다.
  }
}

init(); // 진짜 앱 실행 명령!

// 60초마다 시계를 체크해서 현재 진행중인 일정(초록 테두리)을 새로고침하는 기능
setInterval(refreshCurrentScheduleHighlight, 60 * 1000);

// 다른 앱을 켰다가 다시 돌아왔을 때(가이드북 화면이 다시 켜질 때)에도 바로 갱신해줌
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshCurrentScheduleHighlight();
});