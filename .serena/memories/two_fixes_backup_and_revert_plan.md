# Two Fixes - Backup & Revert Plan

## PRE-FIX STATE BACKUP

### Current Working State (Before 2 fixes):
- CSS Override approach: ✅ WORKING
- Login modal: ✅ WORKING  
- Flashcard display: ✅ WORKING
- Mobile responsive: ✅ WORKING
- Issue 1: Flashcard auto-reopen (event bubbling)
- Issue 2: Video call modal CSS conflict

### Files to be modified:
1. **app.js**: Close flashcard event handler (~line 858)
2. **styles.css**: Add pre-call modal CSS override

## FIX 1: Flashcard Event Bubbling

### What will change:
**Location**: app.js close flashcards event listener
**Current code**:
```javascript
closeFlashcards.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // ← THIS LINE TO BE ADDED
    console.log("❌ Close flashcards clicked");
    this.hideFlashcards();
});
```

**Backup info**: Currently NO stopPropagation() call
**Risk**: Zero risk
**Revert**: Remove the stopPropagation() line

## FIX 2: Pre-call Modal CSS

### What will change:
**Location**: styles.css after existing .modal.show rule
**CSS to add**:
```css
/* Fix for pre-call modal CSS conflicts */
.modal.pre-call-modal.show {
    /* Specific overrides for pre-call modal positioning */
    max-width: 32rem !important;
    width: 90% !important;
}
```

**Backup info**: Currently no specific pre-call modal CSS override
**Risk**: Low risk, very specific selector
**Revert**: Remove the entire CSS rule block

## REVERT STRATEGIES

### REVERT Plan A (Fix 2 only):
If video call modal has CSS issues:
1. Remove added CSS rule from styles.css
2. Keep Fix 1 (event bubbling) - it's working
3. Video call returns to previous state (broken but functional)

### REVERT Plan B (Both fixes):
If major issues occur:
1. Remove CSS rule from styles.css
2. Remove e.stopPropagation() from app.js
3. Return to exact pre-fix state
4. All issues return but system stable

### Testing Checklist:
**Fix 1 Test**:
- [ ] Open flashcard
- [ ] Click close once → should close completely
- [ ] No auto-reopen

**Fix 2 Test**:
- [ ] Click video call button
- [ ] Select partner
- [ ] Pre-call modal displays centered
- [ ] No UI broken elements
- [ ] Test on mobile

### Alternative Approaches (if fixes fail):
1. **Event Delegation**: Different event handling approach
2. **CSS Specificity**: Higher specificity CSS rules
3. **Complete CSS Rewrite**: Start CSS override from scratch
4. **Hybrid Approach**: Mix of comprehensive fix + targeted CSS

## COMMIT PLAN:
1. Commit after Fix 1 (separate commit for easy revert)
2. Commit after Fix 2 (separate commit for easy revert)
3. Each fix can be reverted independently