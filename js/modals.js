document.querySelectorAll('.close').forEach(e => {
  e.addEventListener('click', (event) => {
    const closestModal = event.target.closest('.modal')
    closestModal.style.display = 'none'
  })
})