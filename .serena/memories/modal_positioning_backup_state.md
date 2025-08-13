# Modal Positioning - Current State Backup

## Trạng thái hiện tại (trước CSS Override)

### Current Implementation Status:
- **Option 2**: CHƯA được implement (visibility:hidden vẫn còn trong hideAllModals)  
- **Comprehensive Fix**: ĐÃ implement (thêm visibility:visible trong showXxxModal functions)
- **Option 3b**: ĐÃ revert hoàn toàn

### Issues đang gặp phải:
1. **Flashcard positioning**: position: static, không center được
2. **Close button không hoạt động**: Event fired nhưng modal không đóng
3. **Video call modal "vỡ giao diện"**: position: static, z-index: auto

### Console Log Evidence:
```
🎯 FLASHCARD SECTION DEBUG:
- position: static ❌
- offsetParent: modal-backdrop ✅
- clientHeight: 525 ✅

🎯 PRE-CALL MODAL CSS DEBUG:
- position: static ❌ 
- z-index: auto ❌
```

### Current Code State trong app.js:
- Line 970-971: modal.style.display = 'none'; modal.style.visibility = 'hidden'; (CHƯA revert)
- showLoginModal, showPreCallModal, startFlashcards: có thêm visibility: 'visible'
- hideAllModals: không có exceptModal parameter (đã revert Option 3b)

## CSS Override Approach sắp implement:

### CSS sẽ thêm:
```css
.modal.show {
    position: fixed !important;
    z-index: 1000 !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
}

.modal-backdrop.show {
    z-index: 999 !important;
}
```

### JS changes sẽ thêm:
- modal.classList.add('show') trong showXxxModal functions
- backdrop.classList.add('show')

## Fallback Plans nếu CSS Override fails:

### Plan A: Option 2 Implementation  
- Remove modal.style.visibility = 'hidden' từ hideAllModals
- Keep Comprehensive Fix

### Plan B: Complete Revert + Alternative
- Revert Comprehensive Fix về trạng thái ban đầu
- Implement từ đầu với approach khác

### Plan C: Hybrid Approach
- Selective CSS targeting specific modal types
- JavaScript position calculation fallback