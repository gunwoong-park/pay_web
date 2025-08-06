// 쿠폰함 페이지 JavaScript

// 프로필 모달 관련
const profileButton = document.getElementById('profileButton');
const profileModal = document.getElementById('profileModal');
const modalClose = document.getElementById('modalClose');

if (profileButton && profileModal) {
  profileButton.addEventListener('click', () => {
    profileModal.style.display = 'flex';
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });
}

// 모달 외부 클릭 시 닫기
if (profileModal) {
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });
}

// 쿠폰함 버튼 클릭 이벤트 (현재 페이지이므로 페이지 새로고침)
const couponButton = document.getElementById('couponButton');
if (couponButton) {
  couponButton.addEventListener('click', () => {
    window.location.reload();
  });
}

// 장바구니 버튼 클릭 이벤트
const cartButton = document.getElementById('cartButton');
if (cartButton) {
  cartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
}

// 탭 기능
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 모든 탭 버튼에서 active 클래스 제거
    tabButtons.forEach(btn => btn.classList.remove('active'));
    // 클릭된 탭 버튼에 active 클래스 추가
    button.classList.add('active');
    
    // 모든 탭 콘텐츠 숨기기
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 해당하는 탭 콘텐츠 보이기
    const targetTab = button.id.replace('tab-', '');
    const targetContent = document.getElementById(`${targetTab}-coupons`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// 쿠폰 사용하기 버튼 이벤트
const useButtons = document.querySelectorAll('.coupon-use-btn');
useButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const couponCard = e.target.closest('.coupon-card');
    const couponTitle = couponCard.querySelector('.coupon-title').textContent;
    
    if (confirm(`"${couponTitle}" 쿠폰을 사용하시겠습니까?`)) {
      alert('결제 페이지로 이동합니다.');
      // 실제로는 결제 페이지로 이동하거나 쿠폰 적용 로직 구현
      window.location.href = 'payment.html';
    }
  });
});

// 쿠폰 받기 버튼 이벤트
const receiveButtons = document.querySelectorAll('.coupon-receive-btn');
receiveButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const couponCard = e.target.closest('.coupon-card');
    const couponTitle = couponCard.querySelector('.coupon-title').textContent;
    
    // 버튼 비활성화
    button.disabled = true;
    button.textContent = '받는 중...';
    
    // 실제로는 API 호출
    setTimeout(() => {
      alert(`"${couponTitle}" 쿠폰이 쿠폰함에 추가되었습니다!`);
      button.textContent = '받기 완료';
      button.style.background = '#6B7280';
      
      // 페이지 새로고침하여 보유쿠폰에 추가된 것을 보여줄 수 있음
      // location.reload();
    }, 1000);
  });
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('쿠폰함 페이지가 로드되었습니다.');
});