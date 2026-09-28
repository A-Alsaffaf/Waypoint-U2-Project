// ================== cache elements ==================
const checklistBox = document.getElementById('checklistBox');
const addItemBtn = document.getElementById('addItemBtn');


// ================== declare variables ==================
let itemCount = document.querySelectorAll('.checklist-row').length

// ================== functions ==================

function addNewCheckListRow() {
    const row = document.createElement('div')
    row.className = 'checklist-row'
    row.innerHTML = `
        <input class="checklist-input" type="text" name="checkList[${itemCount}][description]" placeholder="Checklist item" required>
        <button type="button" class="icon-btn remove-item">✕</button>
    `
    addItemBtn.before(row)
    itemCount++
    console.log(itemCount);
    
}

function removeCheckListRow(event) {
    if (event.target.classList.contains('remove-item')) {
        event.target.closest('.checklist-row').remove();
    }
}


// ================== event listeners ==================

addItemBtn.addEventListener('click', addNewCheckListRow)
checklistBox.addEventListener('click', removeCheckListRow)