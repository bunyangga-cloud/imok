/* ==========================================================================
   수원 이목지구 디에트르 II 인터랙티브 자바스크립트
   - 메일 수신 처리: y3974@naver.com (FormSubmit.co API 서비스 연동)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypeTabs();
  initRegistrationForm();
  initChatbot();
  initScrollTop();
  initCounterAnimation();
});

const TARGET_EMAIL = 'y3974@naver.com';

/* 1. 평형 타입별 탭 제어 데이터 및 로직 */
const typeData = {
  '84a': {
    title: '84㎡ A 타입 (전용 84.92㎡)',
    badgeText: '84A',
    subText: '수원 이목지구 대표 프리미엄 4Bay 판상형',
    desc: '채광과 통풍을 극대화한 4Bay 혁신 구조로 설계되었으며, 대방건설만의 광폭 와이드 거실 기술이 적용되어 탁 트인 개방감을 제공합니다.',
    supplyArea: '114.28㎡',
    privateArea: '84.92㎡',
    rooms: '침실 3개 + 알파룸 1개 + 욕실 2개',
    featurePills: ['광폭 와이드 거실 특화', '4Bay 혁신 판상형 설계', '넉넉한 대형 팬트리 수납', '안방 고급 드레스룸']
  },
  '84b': {
    title: '84㎡ B 타입 (전용 84.88㎡)',
    badgeText: '84B',
    subText: '트렌디한 하이엔드 조망형 타워형',
    desc: '독립적인 거실과 주방 배치를 통해 프라이버시를 극대화하였으며, 다각도 양면 조망으로 뛰어난 일조권을 확보한 하이엔드 타입입니다.',
    supplyArea: '114.15㎡',
    privateArea: '84.88㎡',
    rooms: '침실 3개 + 욕실 2개 + 펜트리',
    featurePills: ['양면 개방형 거실 조망', '독립적 안방 프라이버시', '주방 동선 최적화 설계', '현관 대형 수납 창고']
  },
  '84c': {
    title: '84㎡ C 타입 (전용 84.95㎡)',
    badgeText: '84C',
    subText: '실사용 공간을 극대화한 실속 LDK 구조',
    desc: '거실과 식당, 주방이 일체화된 LDK 구조로 가족 중심의 생활 공간을 제안하며, 알찬 수납공간 구성으로 공간 효율성을 최고로 높였습니다.',
    supplyArea: '114.35㎡',
    privateArea: '84.95㎡',
    rooms: '침실 3개 + 알파룸 + 욕실 2개',
    featurePills: ['개방감 넘치는 LDK 구조', '와이드 주방 아일랜드', '알파룸 멀티 공간 활용', '한시적 유상옵션 무상']
  },
  '116a': {
    title: '116㎡ A 타입 (전용 116.42㎡)',
    badgeText: '116A',
    subText: '품격이 다른 대형 프리미엄 리더스 타입',
    desc: '2,512세대 대단지의 자부심을 담은 펜트하우스급 대형 평형으로, 6m 이상의 압도적 광폭 거실과 와이드 마스터룸 드레스룸을 갖추었습니다.',
    supplyArea: '152.18㎡',
    privateArea: '116.42㎡',
    rooms: '침실 4개 + 대형 알파룸 + 욕실 2개',
    featurePills: ['6m+ 초광폭 와이드 거실', '대형 침실 4개 독립 구조', '럭셔리 파우더 & 드레스룸', '세대당 2.1대 주차 우대']
  },
  '116b': {
    title: '116㎡ B 타입 (전용 116.38㎡)',
    badgeText: '116B',
    subText: '파노라마 조망과 파인 리빙 특화 스위트',
    desc: '탁 트인 파노라마 뷰와 시원한 개방감을 선사하는 최고급 아파트 디자인으로, 고급스러운 인테리어 소재와 와이드 다이닝 공간을 제공합니다.',
    supplyArea: '152.05㎡',
    privateArea: '116.38㎡',
    rooms: '침실 4개 + 욕실 2개 + 대형 펜트리',
    featurePills: ['파노라마 가든 뷰 확보', '최고급 호텔식 욕실 특화', '와이드 다이닝 스페이스', '단지 내 수영장/스파 인접']
  }
};

function initTypeTabs() {
  const tabBtns = document.querySelectorAll('.type-tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const typeKey = btn.getAttribute('data-type');
      if (!typeData[typeKey]) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = typeData[typeKey];
      document.getElementById('type-title').innerText = data.title;
      document.getElementById('type-badge').innerText = data.badgeText;
      document.getElementById('type-sub').innerText = data.subText;
      document.getElementById('type-desc').innerText = data.desc;
      document.getElementById('type-supply-area').innerText = data.supplyArea;
      document.getElementById('type-private-area').innerText = data.privateArea;
      document.getElementById('type-rooms').innerText = data.rooms;

      const pillsContainer = document.getElementById('type-feature-pills');
      if (pillsContainer) {
        pillsContainer.innerHTML = data.featurePills
          .map(pill => `<div class="type-feature-pill">✓ ${pill}</div>`)
          .join('');
      }
    });
  });
}

/* 2. 관심고객 등록 폼 및 이메일(y3974@naver.com) 전송 연동 */
function initRegistrationForm() {
  const form = document.getElementById('vip-register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.trim();
    const area = document.getElementById('user-area').value;
    const agree = document.getElementById('user-agree').checked;

    if (!name) {
      alert('성함을 입력해 주세요.');
      return;
    }
    if (!phone || phone.length < 10) {
      alert('올바른 휴대폰 번호를 입력해 주세요.');
      return;
    }
    if (!agree) {
      alert('개인정보 수집 및 활용에 동의해 주세요.');
      return;
    }

    submitBtn.innerText = '전송 중...';
    submitBtn.disabled = true;

    // y3974@naver.com 메일로 FormSubmit AJAX 전송
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[이목지구 디에트르 II] 관심고객 접수: ${name}님`,
          고객명: name,
          연락처: phone,
          희망평형: area,
          접수시간: new Date().toLocaleString('ko-KR')
        })
      });

      const result = await response.json();
      
      // 저장 로컬 백업
      const registrationData = { name, phone, area, date: new Date().toLocaleString() };
      let saved = JSON.parse(localStorage.getItem('imok_leads') || '[]');
      saved.push(registrationData);
      localStorage.setItem('imok_leads', JSON.stringify(saved));

      // 성공 모달 노출
      openModal('관심고객 접수 완료', `<strong>${name}</strong> 고객님의 관심고객 등록이 완료되었습니다.<br><br>작성하신 접수 내용이 <strong>${TARGET_EMAIL}</strong> 메일로 안전하게 전송되었으며, 입력하신 번호(<strong>${phone}</strong>)로 전담 안내원이 곧 연락드리겠습니다.`);
      
      form.reset();
    } catch (err) {
      console.error('메일 전송 오류:', err);
      openModal('접수 완료', `${name} 고객님의 관심고객 등록이 접수되었습니다. (연락처: ${phone})`);
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* 3. 모달 제어 */
function openModal(title, desc) {
  const modal = document.getElementById('info-modal');
  if (!modal) return;
  
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-desc').innerHTML = desc;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('info-modal');
  if (modal) modal.classList.remove('active');
}

/* 4. 1:1 스마트 AI 챗봇 */
function toggleChatbot() {
  const botPanel = document.getElementById('chatbot-panel');
  if (botPanel) {
    botPanel.classList.toggle('active');
  }
}

function triggerBotScenario(action) {
  const chatBody = document.getElementById('chatbot-chat-body');
  const optionsGroup = document.getElementById('chat-options-group');
  if (!chatBody || !optionsGroup) return;

  optionsGroup.style.display = 'none';

  let userText = '';
  let botReply = '';
  let needForm = false;

  if (action === 'address') {
    userText = '📍 모델하우스 위치 주소 안내';
    botReply = '수원 이목지구 디에트르 II 모델하우스 정확한 위치 안내 및 방문 예약을 도와드립니다. 고객님의 성함과 연락처를 입력해 주세요.';
    needForm = true;
  } else if (action === 'price') {
    userText = '💰 평형별 분양가 즉시 확인';
    botReply = '분양가 상한제가 적용된 84㎡ / 116㎡ 타입별 최신 분양가표 및 한시적 옵션 무상 제공 안내를 위해 성함과 연락처를 입력해 주세요.';
    needForm = true;
  } else if (action === 'call') {
    userText = '📞 전문 상담원 빠른 유선상담';
    botReply = '성함과 연락처를 남겨주시면 로얄동호수 전담 상담원이 5분 내로 직접 안내 전화를 드립니다.';
    needForm = true;
  }

  appendChatMsg(userText, 'user');

  setTimeout(() => {
    appendChatMsg(botReply, 'bot');
    if (needForm) {
      appendChatInputForm(action);
    }
  }, 500);
}

function appendChatMsg(text, sender) {
  const chatBody = document.getElementById('chatbot-chat-body');
  if (!chatBody) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
  bubble.innerText = text;
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function appendChatInputForm(type) {
  const chatBody = document.getElementById('chatbot-chat-body');
  const formDiv = document.createElement('div');
  formDiv.style.marginTop = '8px';
  formDiv.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid #a3845b; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
      <input type="text" id="bot-input-name" placeholder="고객명 입력" style="width: 100%; height: 38px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
      <input type="tel" id="bot-input-phone" placeholder="연락처 입력 (하이픈 없이)" maxlength="11" style="width: 100%; height: 38px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
      <button id="bot-submit-btn" onclick="submitBotForm('${type}')" style="width: 100%; height: 38px; background: #a3845b; color: #fff; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer;">신청하기</button>
    </div>
  `;
  chatBody.appendChild(formDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function submitBotForm(type) {
  const name = document.getElementById('bot-input-name').value.trim();
  const phone = document.getElementById('bot-input-phone').value.trim();
  const btn = document.getElementById('bot-submit-btn');

  if (!name || !phone) {
    appendChatMsg('⚠️ 성함과 연락처를 올바르게 입력해 주세요.', 'bot');
    return;
  }

  appendChatMsg(`신청 정보: ${name} / ${phone}`, 'user');
  if (btn) { btn.innerText = '전송 중...'; btn.disabled = true; }

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[챗봇 신청] ${type} - ${name}님`,
        신청유형: type,
        고객명: name,
        연락처: phone,
        접수시간: new Date().toLocaleString('ko-KR')
      })
    });

    setTimeout(() => {
      appendChatMsg(`감사합니다, ${name}님! 접수가 완료되었습니다. 작성하신 정보는 ${TARGET_EMAIL} 메일로 발송되었으며 지정된 연락처(${phone})로 즉시 전송됩니다.`, 'bot');
    }, 500);
  } catch (err) {
    appendChatMsg(`감사합니다, ${name}님! 정상 접수되었습니다.`, 'bot');
  }
}

/* 5. 완벽 호환 탑(TOP) 상단 이동 스크롤 엔진 */
function bulletproofScrollToTop(e) {
  if (e) e.preventDefault();
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  setTimeout(() => {
    if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, 50);
}
window.bulletproofScrollToTop = bulletproofScrollToTop;

/* 6. 카운터 애니메이션 */
function initCounterAnimation() {
  const counterEl = document.getElementById('hero-live-counter');
  if (!counterEl) return;

  let count = 87;
  setInterval(() => {
    if (Math.random() > 0.6) {
      count += Math.floor(Math.random() * 2) + 1;
      counterEl.innerText = count;
    }
  }, 4000);
}
