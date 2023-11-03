const loginPageView = () => {
  const app = document.querySelector('.app')

  app.innerHTML = `
  <div class="container">
    <form class="login" novalidate>
      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="email"
          class="edit-item-input"
          placeholder="test@mail.co"
          required
          />
          <label for="email" class="input-label">Email</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="password"
          id="password"
          class="edit-item-input"
          placeholder="Pa55word$"
          required
          />
          <label for="password" class="input-label">Password</label>
        </div>
      </div>

      <div class="login-btn">
        <button class="btn save-btn">Log in</button>
      </div>
    </form>
  </div>
    `
}

export default loginPageView
