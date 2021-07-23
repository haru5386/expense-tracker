function text() {

  let option = document.querySelectorAll('option')
  const catrgory = document.querySelector('#catrgory')
  const categoryvalue = category.dataset.value

  option.forEach(option => {
    if (categoryvalue === option.value) {
      option.setAttribute("selected", "")
    }
  })
}
text()