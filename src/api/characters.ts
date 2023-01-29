import axios from "axios"

export function getCharsPaginated(page: number, name = '') {
  return axios
    .get(`https://rickandmortyapi.com/api/character/`, {params: {page, name}})
    .then(res => {
      return {
        nextPage: res.data.info.next,
        previousPage: res.data.info.prev,
        chars: res.data.results,
      }
    })
}