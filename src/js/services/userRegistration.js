import request from './requests.js'

class UserRegistration {
  #url = `http://localhost:5555/api`
  fields = document.querySelectorAll('[data-validation]')

  getUsersUniqueEmail = async (email) => {
    const url = this.#url + '/user'
    const data = await request(url, 'POST', { email })
    return data
  }

  getUsersUniqueData = async (value, type) => {
    let body
    if (type === 'email') body = { email: value }
    if (type === 'login') body = { login: value }
    const url = this.#url + '/user'
    const data = await request(url, 'POST', body)
    return data
  }

  postData = async (body) => {
    const url = this.#url + `/user/create`
    const data = await request(url, 'POST', body)
    return data
  }

  checkUniqueData = async (value, type = 'email') => {
    let res
    try {
      res = await this.getUsersUniqueData(value, type)
    } catch (err) {
      console.log(err)
    }

    return res
  }

  createNewUser = async () => {
    const data = {}

    this.fields.forEach((field) => {
      data[field.id] = field.id === 'age' ? +field.value : field.value
    })

    let res
    try {
      res = await this.postData(data)
    } catch (err) {
      return err
    }
    return res
  }
}

export default UserRegistration
