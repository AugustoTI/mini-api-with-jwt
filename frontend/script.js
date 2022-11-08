const listGames = document.querySelector('#games')
const gameName = document.querySelector('#name_game')
const gamePrice = document.querySelector('#price_game')
const gameYear = document.querySelector('#year_game')

const gameNameEdit = document.querySelector('#name_game_edit')
const gamePriceEdit = document.querySelector('#name_price_edit')
const gameYearEdit = document.querySelector('#name_year_edit')
const gameIdEdit = document.querySelector('#name_game_id')

const axiosConfig = {
  headers: {
    Authorization:
      'Bearer ' +
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkZ1bGFub0RlVGFsQGVtYWlsLmNvbSIsImlkIjoiYWFzZHNkIiwiaWF0IjoxNjY3ODczMjc3LCJleHAiOjE2Njc4NzY4Nzd9.ZJSK-r39iQivKk_kTiIf8rQUA2WPoGh1xyXRakyCO0k',
  },
}

window.addEventListener('load', async () => {
  const { data } = await axios.get('http://localhost:3000/games', axiosConfig)

  data.forEach(({ name, price, year, id }) => {
    const priceFormatted = price.toLocaleString('pt-BR', {
      currency: 'BRL',
      style: 'currency',
    })

    const li = document.createElement('li')
    li.innerText = `Nome: ${name} - Ano: ${year} - Preço: ${priceFormatted}`

    li.setAttribute('data-id', id)
    li.setAttribute('data-name', name)
    li.setAttribute('data-price', price)
    li.setAttribute('data-year', year)

    const buttonDelete = document.createElement('button')
    const buttonEdit = document.createElement('button')
    buttonDelete.innerText = 'Deletar'
    buttonEdit.innerText = 'Editar'
    buttonDelete.addEventListener('click', async () => {
      await deleteGame(li)
    })

    buttonEdit.addEventListener('click', () => {
      loadForm(li)
    })

    li.appendChild(buttonDelete)
    li.appendChild(buttonEdit)
    listGames.appendChild(li)
  })
})

const deleteGame = async (listItem) => {
  const id = listItem.getAttribute('data-id')

  await axios.delete('http://localhost:3000/game/' + id, axiosConfig)
}

const loadForm = (listItem) => {
  const id = listItem.getAttribute('data-id')
  const name = listItem.getAttribute('data-name')
  const price = listItem.getAttribute('data-price')
  const year = listItem.getAttribute('data-year')

  gameNameEdit.value = name
  gamePriceEdit.value = price
  gameYearEdit.value = year
  gameIdEdit.value = id
}

const editGame = async () => {
  const game = {
    name: gameNameEdit.value,
    year: Number(gameYearEdit.value),
    price: Number(gamePriceEdit.value),
  }

  await axios.put(
    'http://localhost:3000/game/' + gameIdEdit.value,
    game,
    axiosConfig
  )

  gameNameEdit.value = ''
  gamePriceEdit.value = ''
  gameYearEdit.value = ''
  gameIdEdit.value = ''
}

const createGame = async () => {
  const game = {
    name: gameName.value,
    year: Number(gameYear.value),
    price: Number(gamePrice.value),
  }

  await axios.post('http://localhost:3000/game', game, axiosConfig)
}
