export {makePaymentCall}

function makePaymentCall (response) {
  let paymentForm = document.createElement('FORM')
  paymentForm.name = 'payment_form'
  paymentForm.method = 'POST'
  paymentForm.action = 'https://secure.yatra.com' + new URL(response.rurl).pathname
  let formKeys = Object.keys(response.redirectMap)
  for (let i = 0; i < formKeys.length; i++) {
    let formInput = document.createElement('INPUT')
    formInput.type = 'HIDDEN'
    formInput.name = formKeys[i]
    formInput.value = response.redirectMap[formKeys[i]]
    paymentForm.appendChild(formInput)
  }
  document.body.appendChild(paymentForm)
  paymentForm.submit()
}

