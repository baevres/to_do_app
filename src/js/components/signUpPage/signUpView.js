const signUpView = () => {
  const app = document.querySelector('.app')

  app.innerHTML = `
    <div class="container">
      <form class="registration" novalidate>
        <div class="field-wrapper">
          <div>
            <input
            type="text"
            id="name"
            class="edit-item-input"
            placeholder="John"
            data-validation
            required
            />
            <label for="name" class="input-label">Name</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="number"
            id="age"
            class="edit-item-input"
            placeholder="18"
            data-validation
            required
            />
            <label for="age" class="input-label">Age</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="text"
            id="link"
            class="edit-item-input"
            placeholder="proj-link.com"
            data-validation
            required
            />
            <label for="link" class="input-label">Link to your project</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div class="gender">
            <select
            type="text"
            id="gender"
            class="edit-item-input"
            value=""
            data-validation
            required
            >
            <option value=""></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            </select>
            <label for="gender" class="input-label">Gender</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="tel"
            id="phone"
            class="edit-item-input"
            placeholder="123-456-7890"
            data-validation
            required
            />
            <label for="phone" class="input-label">Phone number</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="text"
            id="login"
            class="edit-item-input"
            placeholder="john21"
            data-validation
            required
            />
            <label for="login" class="input-label">Login</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="text"
            id="email"
            class="edit-item-input"
            placeholder="john21@mail.co"
            data-validation
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
            placeholder="Pa55word#"
            data-validation
            required
            />
            <label for="password" class="input-label">Password</label>
          </div>
        </div>

        <div class="field-wrapper">
          <div>
            <input
            type="password"
            id="confirmPassword"
            class="edit-item-input"
            placeholder="Pa55word#"
            data-validation
            required
            />
            <label for="confirmPassword" class="input-label">
            Confirm Password</label>
          </div>
        </div>

        <button class="btn save-btn">Sign in</button>
      </form>
    </div>
    `
}

export default signUpView
