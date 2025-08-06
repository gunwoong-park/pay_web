// 장바구니 페이지 JavaScript

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

// 쿠폰함 버튼 클릭 이벤트
const couponButton = document.getElementById('couponButton');
if (couponButton) {
  couponButton.addEventListener('click', () => {
    window.location.href = 'coupon.html';
  });
}

// 장바구니 버튼 클릭 이벤트 (현재 페이지이므로 페이지 새로고침)
const cartButton = document.getElementById('cartButton');
if (cartButton) {
  cartButton.addEventListener('click', () => {
    window.location.reload();
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
    const targetContent = document.getElementById(`${targetTab}-products`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// 찜하기 버튼 토글
const wishlistButtons = document.querySelectorAll('.wishlist-btn');
wishlistButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = button.getAttribute('data-product-id');
    const isActive = button.classList.contains('active');
    
    if (isActive) {
      // 찜 제거
      button.classList.remove('active');
      console.log(`상품 ${productId} 찜 제거`);
      
      // 찜한상품 탭에서는 카드 자체를 제거할 수도 있음
      // const productCard = button.closest('.product-card');
      // productCard.remove();
    } else {
      // 찜 추가
      button.classList.add('active');
      console.log(`상품 ${productId} 찜 추가`);
    }
  });
});

// 구매하기 버튼
const buyButtons = document.querySelectorAll('.btn-action.btn-primary');
buyButtons.forEach(button => {
  if (button.textContent.includes('구매하기')) {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      const productTitle = productCard.querySelector('.product-title').textContent;
      
      if (confirm(`"${productTitle}"을(를) 구매하시겠습니까?`)) {
        alert('결제 페이지로 이동합니다.');
        window.location.href = 'payment.html';
      }
    });
  }
});

// 재구매 버튼
const repurchaseButtons = document.querySelectorAll('.btn-action.btn-secondary');
repurchaseButtons.forEach(button => {
  if (button.textContent.includes('재구매')) {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      const productTitle = productCard.querySelector('.product-title').textContent;
      
      if (confirm(`"${productTitle}"을(를) 재구매하시겠습니까?`)) {
        alert('재구매가 진행됩니다.');
        // 실제로는 재구매 로직 구현
        window.location.href = 'payment.html';
      }
    });
  }
});

// 문의하기 버튼
const inquiryButtons = document.querySelectorAll('.btn-action');
inquiryButtons.forEach(button => {
  if (button.textContent.includes('문의하기')) {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      const productTitle = productCard.querySelector('.product-title').textContent;
      
      alert(`"${productTitle}"에 대한 문의가 접수되었습니다.\n담당자가 연락드리겠습니다.`);
    });
  }
});

// 상품 카드 클릭 시 상세 정보 표시
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // 버튼 클릭 시에는 카드 클릭 이벤트 방지
    if (e.target.closest('.wishlist-btn') || e.target.closest('.btn-action')) {
      return;
    }
    
    const productTitle = card.querySelector('.product-title').textContent;
    console.log(`상품 카드 클릭: ${productTitle}`);
    
    // 실제로는 상품 상세 페이지로 이동하거나 모달 표시
    // window.location.href = `product-detail.html?product=${productId}`;
  });
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('장바구니 페이지가 로드되었습니다.');
  
  // 초기 통계 업데이트 (실제로는 API에서 데이터 가져옴)
  updateCartStats();
});

// 장바구니 통계 업데이트 함수
function updateCartStats() {
  const wishlistTab = document.getElementById('wishlist-products');
  const frequentTab = document.getElementById('frequent-products');
  
  if (wishlistTab && frequentTab) {
    // 찜한상품 개수 계산
    const wishlistCount = wishlistTab.querySelectorAll('.product-card').length;
    const discountCount = wishlistTab.querySelectorAll('.discount-badge').length;
    const newCount = wishlistTab.querySelectorAll('.tag:contains("신규상품")').length;
    
    // 자주산상품 통계 계산
    const frequentCount = frequentTab.querySelectorAll('.product-card').length;
    let totalPurchases = 0;
    
    frequentTab.querySelectorAll('.count-number').forEach(countElement => {
      totalPurchases += parseInt(countElement.textContent) || 0;
    });
    
    console.log('장바구니 통계 업데이트:', {
      찜한상품: wishlistCount,
      할인상품: discountCount,
      자주산상품: frequentCount,
      총구매횟수: totalPurchases
    });
  }
}