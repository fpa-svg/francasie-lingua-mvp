// Event Registration Methods - Add to App class

showEventRegistrationModal(eventId) {
    // Check if user is logged in
    if (!currentUser) {
        this.showLoginModal();
        return;
    }

    // Event data
    const events = {
        '1': {
            title: 'Buổi thực hành hội thoại',
            description: 'Tham gia buổi luyện tập giao tiếp tiếng Pháp với các bạn học cùng level'
        },
        '2': {
            title: 'Workshop văn hóa Pháp', 
            description: 'Khám phá ẩm thực và truyền thống Pháp cùng native speakers'
        },
        '3': {
            title: 'Thử thách từ vựng',
            description: 'Tham gia cuộc thi vui về từ vựng tiếng Pháp với nhiều phần quà'
        }
    };

    const eventData = events[eventId] || events['1'];
    
    // Update modal content
    if (this.dom.eventModalTitle) {
        this.dom.eventModalTitle.textContent = `Đăng ký: ${eventData.title}`;
    }
    if (this.dom.eventModalDescription) {
        this.dom.eventModalDescription.textContent = eventData.description;
    }

    // Pre-fill user info if available
    if (currentUser && this.dom.eventParticipantName) {
        this.dom.eventParticipantName.value = currentUser.displayName || '';
    }
    if (currentUser && this.dom.eventParticipantEmail) {
        this.dom.eventParticipantEmail.value = currentUser.email || '';
    }

    // Store event ID for submission
    this.currentEventId = eventId;

    // Show modal
    this.dom.modalBackdrop?.classList.remove('hidden');
    this.dom.eventRegistrationModal?.classList.remove('hidden');
}

hideEventRegistrationModal() {
    this.dom.eventRegistrationModal?.classList.add('hidden');
    this.dom.modalBackdrop?.classList.add('hidden');
    this.currentEventId = null;
    
    // Clear form
    if (this.dom.eventParticipantName) this.dom.eventParticipantName.value = '';
    if (this.dom.eventParticipantEmail) this.dom.eventParticipantEmail.value = '';
    if (this.dom.eventParticipantPhone) this.dom.eventParticipantPhone.value = '';
    if (this.dom.eventParticipantLevel) this.dom.eventParticipantLevel.value = '';
    if (this.dom.eventParticipantNote) this.dom.eventParticipantNote.value = '';
}

async submitEventRegistration() {
    // Validate required fields
    const name = this.dom.eventParticipantName?.value.trim();
    const email = this.dom.eventParticipantEmail?.value.trim();
    
    if (!name || !email) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên và Email)');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập email hợp lệ');
        return;
    }

    // Show loading
    this.setButtonLoading(this.dom.submitEventRegistration, true, '#event-submit-text');

    try {
        // Simulate API call (demo)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Hide registration modal
        this.hideEventRegistrationModal();
        
        // Show success toast
        this.showSuccessToast('Đăng ký thành công!', 'Chúng tôi sẽ gửi thông tin chi tiết qua email của bạn.');
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    } finally {
        this.setButtonLoading(this.dom.submitEventRegistration, false, '#event-submit-text');
    }
}

showSuccessToast(title, message) {
    if (this.dom.toastTitle) {
        this.dom.toastTitle.textContent = title;
    }
    if (this.dom.toastMessage) {
        this.dom.toastMessage.textContent = message;
    }

    // Show toast with animation
    this.dom.successToast?.classList.remove('hidden');
    setTimeout(() => {
        this.dom.successToast?.classList.add('show');
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        this.hideSuccessToast();
    }, 5000);
}

hideSuccessToast() {
    this.dom.successToast?.classList.remove('show');
    setTimeout(() => {
        this.dom.successToast?.classList.add('hidden');
    }, 300);
}