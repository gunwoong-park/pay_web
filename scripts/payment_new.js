// 결제 페이지 스크립트 - 새로운 3단계 구조

// 전역 변수
let originalPrice = 400000;
let selectedCouponDiscount = 0;
let selectedProduct = null;
let isSubscriptionEnabled = false;
let subscriptionDiscount = 0;
let selectedDuration = 1;
let durationDiscount = 0;
let selectedCouponId = null;

// 쿠폰 데이터
const availableCoupons = [
    {
        id: 'coupon1',
        name: '신규 가입 할인 쿠폰',
        type: 'percent',
        value: 10,
        max: 40000,
        description: '첫 구매 시 10% 할인 (최대 4만원)'
    },
    {
        id: 'coupon2', 
        name: '이벤트 할인 쿠폰',
        type: 'fixed',
        value: 50000,
        description: '특가 이벤트 5만원 할인'
    }
];

// 상품 데이터
const productData = {
    'gangnam-premium': {
        name: '강남역 프리미엄 광고',
        desc: '강남역 근처 상가 임대차 광고 - 1개월권',
        location: '서울시 강남구 강남역',
        type: '상가 임대차',
        price: 400000,
        features: ['네모+직방 동시 노출', '상위 노출 보장', '24시간 고객지원']
    },
    'gangnam-basic': {
        name: '강남구 일반 광고',
        desc: '강남구 전체 지역 광고 - 1개월권',
        location: '서울시 강남구',
        type: '상가 임대차',
        price: 250000,
        features: ['기본 노출', '지역 타겟팅', '고객지원']
    },
    'seocho-premium': {
        name: '서초역 프리미엄 광고',
        desc: '서초역 근처 상업지구 광고 - 1개월권',
        location: '서울시 서초구 서초역',
        type: '상가 임대차',
        price: 380000,
        features: ['네모+직방 동시 노출', '상위 노출 보장', '24시간 고객지원']
    },
    'sinsa-special': {
        name: '신사동 특화 광고',
        desc: '신사동 가로수길 맛집거리 광고 - 1개월권',
        location: '서울시 강남구 신사동',
        type: '음식점 특화',
        price: 450000,
        features: ['맛집 특화', '네모+직방+배달의민족 노출', '프리미엄 위치']
    }
};

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initPaymentPage();
});

// 결제 페이지 초기화
function initPaymentPage() {
    initProductSelection();
    initDurationSelection();
    initInlineCoupon();
    initCouponSelection();
    initSubscriptionToggle();
    initViewCouponsButton();
    initPaymentButton();
    
    // 초기 정기결제 상태 설정
    const subscriptionCheckbox = document.getElementById('subscriptionCheckbox');
    if (subscriptionCheckbox && subscriptionCheckbox.checked) {
        isSubscriptionEnabled = true;
        const subscriptionBenefits = document.getElementById('subscriptionBenefits');
        if (subscriptionBenefits) {
            subscriptionBenefits.style.display = 'block';
        }
    }
    
    // 초기 총액 계산
    updatePaymentSummary();
}

// 상품 선택 기능 초기화
function initProductSelection() {
    const selectProductBtn = document.getElementById('selectProductBtn');
    const changeProductBtn = document.getElementById('changeProductBtn');
    const productModal = document.getElementById('productSearchModal');
    const closeModalBtn = document.getElementById('closeProductModal');
    const searchInput = document.getElementById('productSearchInput');
    const searchBtn = document.getElementById('searchBtn');

    // 상품 선택 버튼 클릭
    if (selectProductBtn) {
        selectProductBtn.addEventListener('click', function() {
            showProductModal();
        });
    }

    // 상품 변경 버튼 클릭
    if (changeProductBtn) {
        changeProductBtn.addEventListener('click', function() {
            showProductModal();
        });
    }

    // 모달 닫기
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideProductModal();
        });
    }

    // 검색 기능
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // 모달 외부 클릭 시 닫기
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                console.log('모달 외부 클릭으로 닫기');
                hideProductModal();
            }
        });
    }

    // 검색 결과 및 추천 상품 클릭 이벤트 (DOM 전체에서 위임)
    document.addEventListener('click', function(e) {
        // 검색 결과 클릭
        const resultItem = e.target.closest('.result-item');
        if (resultItem && resultItem.dataset.product) {
            e.preventDefault();
            e.stopPropagation();
            const productId = resultItem.dataset.product;
            console.log('검색 결과 클릭:', productId);
            selectProduct(productId);
            return;
        }
        
        // 추천 상품 선택 버튼 클릭
        if (e.target.classList.contains('select-recommended-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const recommendedItem = e.target.closest('.recommended-item');
            if (recommendedItem && recommendedItem.dataset.product) {
                const productId = recommendedItem.dataset.product;
                console.log('추천 상품 선택:', productId);
                selectProduct(productId);
            }
            return;
        }
    });
}

// 상품 모달 표시
function showProductModal() {
    const modal = document.getElementById('productSearchModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // 검색 입력창에 포커스
        const searchInput = document.getElementById('productSearchInput');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

// 상품 모달 숨기기
function hideProductModal() {
    const modal = document.getElementById('productSearchModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        console.log('상품 모달이 닫혔습니다.');
    }
}

// 검색 수행
function performSearch() {
    const searchInput = document.getElementById('productSearchInput');
    const searchResults = document.getElementById('searchResults');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.includes('강남') || query.includes('gangnam')) {
        searchResults.style.display = 'block';
        console.log('강남역 검색 결과 표시');
    } else if (query === '') {
        searchResults.style.display = 'none';
    } else {
        // 다른 검색어의 경우 결과 없음 표시
        searchResults.style.display = 'block';
        const resultList = searchResults.querySelector('.result-list');
        resultList.innerHTML = '<div style="padding: 20px; text-align: center; color: #777d83;">검색 결과가 없습니다. "강남"을 검색해보세요.</div>';
    }
}

// 기간 선택 초기화
function initDurationSelection() {
    const durationRadios = document.querySelectorAll('input[name="duration"]');
    
    durationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedDuration = parseInt(this.value);
                calculateDurationDiscount();
                updatePaymentSummary();
                
                console.log('기간 선택됨:', selectedDuration + '개월');
            }
        });
    });
    
    // 초기 선택된 기간 설정
    const checkedDuration = document.querySelector('input[name="duration"]:checked');
    if (checkedDuration) {
        selectedDuration = parseInt(checkedDuration.value);
        calculateDurationDiscount();
    }
}

// 기간별 할인 계산
function calculateDurationDiscount() {
    const totalAmount = originalPrice * selectedDuration;
    
    switch (selectedDuration) {
        case 1:
            durationDiscount = 0;
            break;
        case 3:
            // 5% 할인
            durationDiscount = Math.floor(totalAmount * 0.05);
            break;
        case 6:
            // 33% 할인
            durationDiscount = Math.floor(totalAmount * 0.33);
            break;
        default:
            durationDiscount = 0;
    }
}

// 인라인 쿠폰 초기화
function initInlineCoupon() {
    const sel = document.getElementById('couponSelect');
    const amountEl = document.getElementById('couponInlineAmount');
    if (!sel || !amountEl) return;

    // 1) 옵션 주입
    sel.innerHTML = '';
    
    // 기본 옵션: 쿠폰 사용 안함
    const optNone = document.createElement('option');
    optNone.value = '';
    optNone.textContent = '쿠폰 사용 안함';
    sel.appendChild(optNone);

    // 사용 가능한 쿠폰들 추가
    availableCoupons.forEach(coupon => {
        const opt = document.createElement('option');
        let label;
        
        if (coupon.type === 'percent') {
            label = `[${coupon.value}%] ${coupon.name}`;
            if (coupon.max) {
                label += ` (최대 ${formatCurrency(coupon.max)})`;
            }
        } else {
            label = `[${formatCurrency(coupon.value)}] ${coupon.name}`;
        }
        
        opt.value = coupon.id;
        opt.textContent = label;
        sel.appendChild(opt);
    });

    // 2) 변경 핸들러
    sel.addEventListener('change', function() {
        const id = sel.value;
        selectedCouponId = id || null;

        // 쿠폰 할인 금액 계산
        const discount = id ? calcCouponDiscount(id) : 0;
        selectedCouponDiscount = discount;
        
        // UI 업데이트
        amountEl.textContent = `-${formatCurrency(discount)}`;
        
        // 기존 라디오 버튼 쿠폰 선택 해제
        const couponRadios = document.querySelectorAll('input[name="coupon"]');
        couponRadios.forEach(radio => {
            radio.checked = false;
        });
        
        // 쿠폰 없음 라디오 선택 (기존 UI와 동기화)
        const noCouponRadio = document.getElementById('noCoupon');
        if (noCouponRadio && !id) {
            noCouponRadio.checked = true;
        }

        // 합계 재계산
        updatePaymentSummary();
        
        console.log('인라인 쿠폰 선택됨:', id, '할인금액:', discount);
    });

    // 3) 기본값 세팅
    selectedCouponId = null;
    selectedCouponDiscount = 0;
    amountEl.textContent = '-0원';
}

// 쿠폰 할인 금액 계산
function calcCouponDiscount(couponId) {
    const coupon = availableCoupons.find(c => c.id === couponId);
    if (!coupon) return 0;

    const totalAmount = originalPrice * selectedDuration;
    const afterDurationDiscount = totalAmount - durationDiscount;
    
    if (coupon.type === 'percent') {
        const percentDiscount = Math.floor(afterDurationDiscount * (coupon.value / 100));
        return coupon.max ? Math.min(percentDiscount, coupon.max) : percentDiscount;
    } else {
        return coupon.value;
    }
}

// 통화 포맷 함수
function formatCurrency(amount) {
    return amount.toLocaleString() + '원';
}

// 쿠폰 선택 초기화
function resetCouponSelection() {
    const noCouponRadio = document.getElementById('noCoupon');
    if (noCouponRadio) {
        noCouponRadio.checked = true;
        updateCouponSelection();
    }
}

// 정기결제 토글 초기화
function resetSubscriptionToggle() {
    const subscriptionCheckbox = document.getElementById('subscriptionCheckbox');
    const subscriptionBenefits = document.getElementById('subscriptionBenefits');
    
    if (subscriptionCheckbox) {
        subscriptionCheckbox.checked = true;
        isSubscriptionEnabled = true;
        calculateSubscriptionDiscount();
        
        if (subscriptionBenefits) {
            subscriptionBenefits.style.display = 'block';
        }
    }
    console.log('정기결제 상태가 초기화되었습니다.');
}

// 상품 선택
function selectProduct(productId) {
    console.log('selectProduct 함수 호출됨:', productId);
    
    const product = productData[productId];
    if (!product) {
        console.error('상품을 찾을 수 없습니다:', productId);
        return;
    }

    selectedProduct = productId;
    originalPrice = product.price;

    console.log('상품 데이터:', product);

    // 모달 먼저 닫기
    hideProductModal();

    // UI 업데이트
    updateSelectedProductUI(product);
    
    // 기간 선택 초기화 (새 상품 선택 시)
    selectedDuration = 1;
    const duration1Radio = document.getElementById('duration1');
    if (duration1Radio) {
        duration1Radio.checked = true;
    }
    calculateDurationDiscount();
    
    // 쿠폰 할인 초기화 (새 상품 선택 시)
    selectedCouponDiscount = 0;
    selectedCouponId = null;
    
    // 인라인 쿠폰 초기화
    const couponSelect = document.getElementById('couponSelect');
    const couponInlineAmount = document.getElementById('couponInlineAmount');
    if (couponSelect) {
        couponSelect.value = '';
    }
    if (couponInlineAmount) {
        couponInlineAmount.textContent = '-0원';
    }
    
    resetCouponSelection();
    
    // 정기결제 상태 초기화
    resetSubscriptionToggle();
    
    // 결제 금액 업데이트
    updatePaymentSummary();
    
    console.log('상품 선택 완료:', product.name, product.price.toLocaleString() + '원');
}

// 선택된 상품 UI 업데이트
function updateSelectedProductUI(product) {
    // 선택 버튼 숨기기, 상품 정보 보이기
    const selector = document.querySelector('.product-selector');
    const summary = document.getElementById('selectedProduct');
    
    if (selector && summary) {
        selector.style.display = 'none';
        summary.style.display = 'flex';
    }

    // 상품 정보 업데이트
    const nameElement = document.getElementById('selectedProductName');
    const descElement = document.getElementById('selectedProductDesc');
    const locationElement = document.getElementById('specLocation');
    const typeElement = document.getElementById('specType');
    const priceElement = document.getElementById('selectedProductPrice');
    const featuresElement = document.getElementById('selectedProductFeatures');

    if (nameElement) nameElement.textContent = product.name;
    if (descElement) descElement.textContent = product.desc;
    if (locationElement) locationElement.textContent = product.location;
    if (typeElement) typeElement.textContent = product.type;
    if (priceElement) priceElement.textContent = product.price.toLocaleString() + '원';
    
    // 특징 배지 업데이트
    if (featuresElement) {
        featuresElement.innerHTML = product.features.map(feature => 
            `<span class="feature-badge">${feature}</span>`
        ).join('');
    }
}

// 쿠폰 선택 초기화
function initCouponSelection() {
    const couponRadios = document.querySelectorAll('input[name="coupon"]');
    
    couponRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const discountAmount = parseInt(this.dataset.discount) || 0;
                selectedCouponDiscount = discountAmount;
                
                // 선택된 쿠폰 스타일 업데이트
                updateCouponSelection();
                
                // 결제 금액 업데이트
                updatePaymentSummary();
                
                console.log('쿠폰 선택됨:', this.value, '할인금액:', discountAmount);
            }
        });
    });
}

// 쿠폰 선택 UI 업데이트
function updateCouponSelection() {
    const couponItems = document.querySelectorAll('.coupon-item');
    
    couponItems.forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        const label = item.querySelector('.coupon-label');
        
        if (radio.checked) {
            item.style.borderColor = '#F24B39';
            label.style.background = '#FEF7F6';
        } else {
            item.style.borderColor = '#EBEBEC';
            label.style.background = 'transparent';
        }
    });
}

// 보유 쿠폰 확인 버튼
function initViewCouponsButton() {
    const viewCouponsBtn = document.getElementById('viewCouponsBtn');
    
    if (viewCouponsBtn) {
        viewCouponsBtn.addEventListener('click', function() {
            // 쿠폰함 페이지로 이동
            window.open('coupon.html', '_blank');
        });
    }
}

// 정기결제 토글 초기화
function initSubscriptionToggle() {
    const subscriptionCheckbox = document.getElementById('subscriptionCheckbox');
    const subscriptionBenefits = document.getElementById('subscriptionBenefits');
    
    if (subscriptionCheckbox) {
        subscriptionCheckbox.addEventListener('change', function() {
            isSubscriptionEnabled = this.checked;
            
            // 혜택 정보 표시/숨김
            if (subscriptionBenefits) {
                subscriptionBenefits.style.display = this.checked ? 'block' : 'none';
            }
            
            // 정기결제 할인 계산
            calculateSubscriptionDiscount();
            
            // 결제 금액 업데이트
            updatePaymentSummary();
            
            console.log('정기결제 토글:', this.checked ? '활성화' : '비활성화');
        });
    }
}

// 정기결제 할인 계산
function calculateSubscriptionDiscount() {
    if (isSubscriptionEnabled) {
        // 기간 할인과 쿠폰 할인 적용 후 금액의 3% 할인
        const totalAmount = originalPrice * selectedDuration;
        const afterDurationAndCouponAmount = totalAmount - durationDiscount - selectedCouponDiscount;
        subscriptionDiscount = Math.floor(afterDurationAndCouponAmount * 0.03);
    } else {
        subscriptionDiscount = 0;
    }
}

// 결제 금액 요약 업데이트
function updatePaymentSummary() {
    // 기간 할인 재계산
    calculateDurationDiscount();
    
    // 정기결제 할인 재계산
    calculateSubscriptionDiscount();
    
    const totalAmount = originalPrice * selectedDuration;
    const finalAmount = Math.max(0, totalAmount - durationDiscount - selectedCouponDiscount - subscriptionDiscount);
    
    // UI 업데이트
    const baseProductAmountElement = document.getElementById('baseProductAmount');
    const durationDiscountElement = document.getElementById('durationDiscount');
    const durationDiscountRow = document.getElementById('durationDiscountRow');
    const durationDiscountLabel = document.getElementById('durationDiscountLabel');
    const couponDiscountElement = document.getElementById('appliedCouponDiscount');
    const subscriptionDiscountElement = document.getElementById('subscriptionDiscount');
    const subscriptionDiscountRow = document.getElementById('subscriptionDiscountRow');
    const finalAmountElement = document.getElementById('finalAmount');
    const paymentBtnAmount = document.getElementById('paymentBtnAmount');
    const paymentBtnType = document.getElementById('paymentBtnType');
    
    // 기본 상품 금액 표시
    if (baseProductAmountElement) {
        baseProductAmountElement.textContent = `${originalPrice.toLocaleString()}원 × ${selectedDuration}개월`;
    }
    
    // 기간 할인 표시
    if (durationDiscountElement && durationDiscountRow && durationDiscountLabel) {
        if (durationDiscount > 0) {
            durationDiscountRow.style.display = 'flex';
            const discountPercent = selectedDuration === 3 ? '5%' : selectedDuration === 6 ? '33%' : '0%';
            durationDiscountLabel.textContent = `기간 할인 (${discountPercent})`;
            durationDiscountElement.textContent = `-${durationDiscount.toLocaleString()}원`;
        } else {
            durationDiscountRow.style.display = 'none';
        }
    }
    
    // 쿠폰 할인 표시
    if (couponDiscountElement) {
        couponDiscountElement.textContent = selectedCouponDiscount > 0 ? 
            `-${selectedCouponDiscount.toLocaleString()}원` : '-0원';
    }
    
    // 정기결제 할인 표시
    if (subscriptionDiscountElement && subscriptionDiscountRow) {
        if (isSubscriptionEnabled && subscriptionDiscount > 0) {
            subscriptionDiscountRow.style.display = 'flex';
            subscriptionDiscountElement.textContent = `-${subscriptionDiscount.toLocaleString()}원`;
        } else {
            subscriptionDiscountRow.style.display = 'none';
        }
    }
    
    // 최종 금액 표시
    if (finalAmountElement) {
        finalAmountElement.textContent = `${finalAmount.toLocaleString()}원`;
    }
    
    // 결제 버튼 업데이트
    if (paymentBtnAmount) {
        paymentBtnAmount.textContent = `${finalAmount.toLocaleString()}원`;
    }
    
    if (paymentBtnType) {
        paymentBtnType.textContent = isSubscriptionEnabled ? '정기결제 신청하기' : '결제하기';
    }
    
    // 결제 버튼 활성화
    const paymentBtn = document.getElementById('proceedPaymentBtn');
    if (paymentBtn) {
        paymentBtn.disabled = false;
        
        // 무료인 경우 버튼 텍스트 변경
        if (finalAmount === 0) {
            if (isSubscriptionEnabled) {
                paymentBtn.innerHTML = '무료 정기결제 시작하기';
            } else {
                paymentBtn.innerHTML = '무료로 시작하기';
            }
        }
    }
}

// 결제 버튼 초기화
function initPaymentButton() {
    const paymentBtn = document.getElementById('proceedPaymentBtn');
    
    if (paymentBtn) {
        paymentBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const totalAmount = originalPrice * selectedDuration;
            const finalAmount = Math.max(0, totalAmount - durationDiscount - selectedCouponDiscount - subscriptionDiscount);
            
            // 결제 진행 확인
            const confirmMessage = finalAmount === 0 ? 
                '무료로 광고를 시작하시겠습니까?' : 
                `${finalAmount.toLocaleString()}원을 결제하시겠습니까?`;
                
            if (confirm(confirmMessage)) {
                processPayment(finalAmount);
            }
        });
    }
}

// 결제 처리
function processPayment(amount) {
    // 결제 진행 모달 표시
    showPaymentModal();
    
    // 실제로는 결제 API 호출
    setTimeout(() => {
        hidePaymentModal();
        
        if (amount === 0) {
            showSuccessModal(amount, '무료 이용');
        } else {
            showSuccessModal(amount, '신용카드');
        }
        
        // 성공 효과음
        playSuccessSound();
        
    }, 2000);
}

// 결제 진행 모달 표시
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

// 결제 진행 모달 숨기기
function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 성공 모달 표시
function showSuccessModal(amount, method) {
    const modal = document.getElementById('successModal');
    const paidAmount = document.getElementById('paidAmount');
    const paymentDate = document.getElementById('paymentDate');
    const paymentMethod = document.getElementById('paymentMethod');
    
    if (modal) {
        // 결제 정보 설정
        if (paidAmount) {
            paidAmount.textContent = `${amount.toLocaleString()}원`;
        }
        
        if (paymentDate) {
            paymentDate.textContent = formatDateTime(new Date());
        }
        
        if (paymentMethod) {
            paymentMethod.textContent = method;
        }
        
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

// 성공 모달 닫기
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 모달 닫기 이벤트
document.addEventListener('click', function(e) {
    // 성공 모달 닫기 버튼
    if (e.target.id === 'closeSuccessModal') {
        hideSuccessModal();
    }
    
    // 모달 외부 클릭 시 닫기
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
});

// 유틸리티 함수들
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function playSuccessSound() {
    // Web API를 사용한 간단한 성공음
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
    // ESC 키로 모달 닫기
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal && activeModal.id !== 'paymentModal') {
            activeModal.classList.remove('show');
            setTimeout(() => {
                activeModal.style.display = 'none';
            }, 300);
        }
    }
});

// 페이지 로드 완료 시 초기 UI 설정
document.addEventListener('DOMContentLoaded', function() {
    // 쿠폰 선택 상태 초기화
    updateCouponSelection();
    
    console.log('결제 페이지가 로드되었습니다.');
    console.log('초기 상품 금액:', originalPrice.toLocaleString() + '원');
});