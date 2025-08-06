// 메모를 로컬스토리지에서 불러오기
function loadMemos() {
  const memos = JSON.parse(localStorage.getItem('memos') || '[]');
  return memos;
}

// 메모를 로컬스토리지에 저장하기
function saveMemos(memos) {
  localStorage.setItem('memos', JSON.stringify(memos));
}

// 메모 리스트를 화면에 렌더링
function renderMemos() {
  const memoList = document.getElementById('memoList');
  memoList.innerHTML = '';
  const memos = loadMemos();
  memos.forEach((memo, idx) => {
    const li = document.createElement('li');
    li.textContent = memo;
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.className = 'delete-btn';
    delBtn.onclick = function() {
      deleteMemo(idx);
    };
    li.appendChild(delBtn);
    memoList.appendChild(li);
  });
}

// 메모 추가
function addMemo() {
  const memoText = document.getElementById('memoText');
  const text = memoText.value.trim();
  if (text === '') return;
  const memos = loadMemos();
  memos.push(text);
  saveMemos(memos);
  memoText.value = '';
  renderMemos();
}

// 메모 삭제
function deleteMemo(idx) {
  const memos = loadMemos();
  memos.splice(idx, 1);
  saveMemos(memos);
  renderMemos();
}

// 결제 방식 탭 전환
const tabs = document.querySelectorAll('.tab');
const methodContents = {
  card: document.getElementById('card-form'),
  toss: document.getElementById('toss-form'),
  kakao: document.getElementById('kakao-form'),
  naver: document.getElementById('naver-form'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    Object.values(methodContents).forEach(el => el.style.display = 'none');
    methodContents[tab.dataset.method].style.display = 'block';
  });
});

// 결제 버튼 클릭 이벤트
const payBtn = document.querySelector('.pay-btn');
payBtn.addEventListener('click', function() {
  const activeMethod = document.querySelector('.tab.active').dataset.method;
  if (activeMethod === 'card') {
    // 카드 결제 입력값 검사
    const cardInputs = methodContents.card.querySelectorAll('input');
    const [cardNum, exp, cvc, owner] = Array.from(cardInputs).map(i => i.value.trim());
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNum)) {
      alert('카드번호를 정확히 입력하세요. (예: 1234 5678 9012 3456)');
      cardInputs[0].focus();
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      alert('유효기간을 MM/YY 형식으로 입력하세요.');
      cardInputs[1].focus();
      return;
    }
    if (!/^\d{3}$/.test(cvc)) {
      alert('CVC를 3자리 숫자로 입력하세요.');
      cardInputs[2].focus();
      return;
    }
    if (owner.length < 2) {
      alert('카드 소유자명을 입력하세요.');
      cardInputs[3].focus();
      return;
    }
    alert('카드 결제가 완료되었습니다!');
  } else if (activeMethod === 'toss') {
    alert('토스페이 결제가 완료되었습니다!');
  } else if (activeMethod === 'kakao') {
    alert('카카오페이 결제가 완료되었습니다!');
  } else if (activeMethod === 'naver') {
    alert('네이버페이 결제가 완료되었습니다!');
  }
});

document.getElementById('addMemoBtn').addEventListener('click', addMemo);
window.onload = renderMemos; 