const listGroup = document.querySelector('.list-group')

listGroup.addEventListener('click', event => {
  let id = ''
  if (event.target.matches('.delete-button')) {
    id = event.target.dataset.id
  } else if (event.target.matches('.fa-trash-alt')) {
    id = event.target.parentElement.dataset.id
  }
  const deleteForm = document.querySelector('#delete-form')
  deleteForm.action = `/records/${id}?_method=DELETE`
})



