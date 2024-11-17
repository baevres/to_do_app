import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const FormTemplate = ({ formOpts, fieldsOpts, validationFunc, submitFunc }) => {
  const [isSubmit, setIsSubmit] = useState(false)

  const setInitialValues = (fieldsOpts) => {
    const initialValues = {}
    fieldsOpts.forEach(({ id }) => {
      initialValues[id] = ''
    })
    return initialValues
  }
  const generateFields = (fieldsOpts) => {
    return fieldsOpts.map((fieldOpt) => {
      const { id, type, placeholder, label, fieldClass, labelClass } = fieldOpt
      let field
      if (type === 'select') {
        const { options } = fieldOpt
        field = (
          <Field
            as="select"
            type={type}
            id={id}
            className={fieldClass}
            name={id}
            required
          >
            <option value="">{null}</option>
            {options.map((opt, i) => {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              )
            })}
          </Field>
        )
      } else {
        field = (
          <Field
            type={type}
            id={id}
            className={fieldClass}
            placeholder={placeholder}
            name={id}
            data-validation
            required
          />
        )
      }

      return (
        <div className="field-wrapper" key={id}>
          <div>
            {field}
            <label htmlFor={id} className={labelClass}>
              {label}
            </label>
          </div>
          <ErrorMessage className="error-message" name={id} component="div" />
        </div>
      )
    })
  }

  const initialValues = setInitialValues(fieldsOpts)

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur={false}
      validate={async (values) => {
        if (isSubmit) {
          const errors = await validationFunc(values)
          return errors
        }
        return {}
      }}
      onSubmit={async (values, { resetForm, setErrors }) => {
        setIsSubmit(true)
        const errors = await validationFunc(values)
        setErrors(errors)

        if (Object.keys(errors).length === 0) {
          await submitFunc(values)
          resetForm()
          setIsSubmit(false)
        }
      }}
    >
      {({ errors, touched, handleSubmit }) => (
        <Form
          className={formOpts.formClass}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(e)
          }}
          noValidate
        >
          {generateFields(fieldsOpts)}
          <div className={formOpts.btnClass}>
            <button type="submit" className="btn save-btn">
              {formOpts.btn}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default FormTemplate
