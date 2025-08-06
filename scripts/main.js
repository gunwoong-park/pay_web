// 네모 광고 페이지 메인 스크립트

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 폼 검증 및 제출 처리
    initContactForm();
    
    // 스크롤 이벤트 처리
    initScrollEffects();
    
    // 고정 하단 바 인터랙션
    initFixedBottom();
    
    // 네비게이션 인터랙션
    initNavigation();
    
    // 프로필 모달 초기화
    initProfileModal();
    
    // 쿠폰함 버튼 이벤트
    initCouponButton();
    
    // 장바구니 버튼 이벤트
    initCartButton();

    // 중개사 회원가입 버튼 클릭 시 페이지 이동 방지
    const joinBtn = document.querySelector('a.btn.btn-secondary[href="payment.html"]');
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });
    }
});

// 연락처 폼 초기화
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.form-submit');
    const checkbox = document.getElementById('agreement');
    const inputs = form.querySelectorAll('input[required]');
    
    // 폼 검증
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                }
            } else {
                if (!input.value.trim()) {
                    isValid = false;
                } else {
                    // 이메일 검증
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                        }
                    }
                    // 전화번호 검증
                    if (input.type === 'tel') {
                        const phoneRegex = /^[0-9]{10,11}$/;
                        if (!phoneRegex.test(input.value.replace(/-/g, ''))) {
                            isValid = false;
                        }
                    }
                }
            }
        });
        
        submitBtn.disabled = !isValid;
        return isValid;
    }
    
    // 실시간 검증
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });
    
    // 전화번호 자동 포매팅
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 11) {
            if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
            }
        }
        e.target.value = value;
    });
    
    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('모든 필수 항목을 올바르게 입력해주세요.');
            return;
        }
        
        // 로딩 상태
        submitBtn.innerHTML = '<span class="loading"></span> 문의 중...';
        submitBtn.disabled = true;
        
        // 시뮬레이션 (실제로는 서버로 데이터 전송)
        setTimeout(() => {
            alert('문의가 성공적으로 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.');
            
            // 폼 초기화
            form.reset();
            submitBtn.innerHTML = '문의하기';
            submitBtn.disabled = true;
            
            // 성공 메시지 표시
            showSuccessMessage();
        }, 2000);
    });
    
    // 초기 검증
    validateForm();
}

// 성공 메시지 표시
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message show';
    successMsg.textContent = '문의가 접수되었습니다. 담당자가 연락드리겠습니다.';
    
    form.insertBefore(successMsg, form.firstChild);
    
    setTimeout(() => {
        successMsg.remove();
    }, 5000);
}

// 스크롤 효과 초기화
function initScrollEffects() {
    // 스크롤 시 헤더 그림자 효과
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 섹션 애니메이션 (Intersection Observer)
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}

// 고정 하단 바 초기화
function initFixedBottom() {
    const onlineInquiry = document.getElementById('openContactForm');
    if (!onlineInquiry) return; // 요소가 없으면 함수 종료
    onlineInquiry.addEventListener('click', function() {
        // 문의 폼으로 스크롤
        const contactSection = document.querySelector('.contact-section');
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // 첫 번째 입력 필드에 포커스
        setTimeout(() => {
            document.getElementById('officeName').focus();
        }, 800);
    });
}

// 네비게이션 초기화
function initNavigation() {
    // 서브 네비게이션 탭 전환
    const subNavItems = document.querySelectorAll('.sub-nav-item');
    
    subNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 탭에서 active 클래스 제거
            subNavItems.forEach(tab => tab.classList.remove('active'));
            
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            
            // 해당 섹션으로 스크롤 (실제 구현에서는 페이지 이동 또는 콘텐츠 변경)
            const href = this.querySelector('a').getAttribute('href');
            if (href.startsWith('#')) {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // 메인 네비게이션 호버 효과
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// 유틸리티 함수들
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phone;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 성능 최적화를 위한 디바운스 적용
const debouncedScrollHandler = debounce(function() {
    // 스크롤 관련 처리가 필요한 경우 여기에 추가
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// 프로필 모달 초기화
function initProfileModal() {
    const profileButton = document.getElementById('profileButton');
    const modal = document.getElementById('profileModal');
    const closeButton = document.getElementById('modalClose');
    
    console.log('Profile modal elements:', { profileButton, modal, closeButton });
    
    if (!profileButton || !modal || !closeButton) {
        console.error('Profile modal elements not found');
        return;
    }
    
    // 프로필 버튼 클릭 시 모달 열기
    profileButton.addEventListener('click', function(e) {
        console.log('Profile button clicked');
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
    
    // X 버튼 클릭 시 모달 닫기
    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });
    
    // 모달 배경 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // 모달 열기 함수
    function openModal() {
        console.log('Opening modal');
        modal.style.display = 'flex';
        // 다음 프레임에서 show 클래스 추가 (애니메이션을 위해)
        requestAnimationFrame(() => {
            modal.classList.add('show');
            console.log('Modal show class added');
        });
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';
    }
    
    // 모달 닫기 함수
    function closeModal() {
        modal.classList.add('closing');
        modal.classList.remove('show');
        // 애니메이션 완료 후 display none
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
        // body 스크롤 복원
        document.body.style.overflow = '';
    }
}

// 쿠폰함 버튼 초기화
function initCouponButton() {
    const couponButton = document.getElementById('couponButton');
    
    if (couponButton) {
        couponButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 쿠폰함 페이지로 이동
            window.location.href = 'coupon.html';
        });
    }
}

// 장바구니 버튼 초기화
function initCartButton() {
    const cartButton = document.getElementById('cartButton');
    
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 장바구니 페이지로 이동
            window.location.href = 'cart.html';
        });
    }
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 필요한 정리 작업
});