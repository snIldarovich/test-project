import "../scss/style.scss";

//прелоадер при загрузке формы
window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 1500);
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");

  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const checkboxInputs = form.querySelectorAll('[name="checkbox"]');
  
  const submitButton = form.querySelector(".form__btn");
  let isFormValid = false;

  form.addEventListener("submit", handleSubmit);

  async function fetchData() {
    const response = await fetch(
      "https://5b99e451-9e93-4711-930d-4b4c59a02013.mock.pstmn.io"
    );
    if (!response.ok) {
      alert("Ошибка HTTP: " + response.status);
      return;
    }
    const data = await response.json();
    updateFormWithData(data);
  }

  //подтягивание данные с GET запроса в форму
  function updateFormWithData(data) {
    form.querySelector("[name=name]").value = data.name;
    form.querySelector("[name=email]").value = data.email;

    const paramsArray = Array.isArray(data.params) ? data.params : [];
    checkboxInputs.forEach((checkboxInput, index) => {
      if (paramsArray.includes(checkboxInput.value)) {
        checkboxInput.checked = true;
      } else {
        checkboxInput.checked = false;
      }
    });
    console.log("Получаем данные");
    console.log(data);
    console.log("Вывод массива с присвоенным значением");
    console.log([...checkboxInputs].map((input) => input.checked));
  }

  // отправка POST запроса
  async function sendData() {
    const checkValue = [];
    form.querySelectorAll("[name=checkbox]").forEach((input) => {
      if (input.checked) {
        checkValue.push(input.value);
      }
    });

    const response = await fetch(
      "https://5b99e451-9e93-4711-930d-4b4c59a02013.mock.pstmn.io",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          nameValue: nameInput.value,
          emailValue: emailInput.value,
          checkboxInput: checkValue,
        }),
      }
    );
    console.log("-------");
    console.log(nameInput.value);
    console.log(emailInput.value);
    console.log(checkValue);
    console.log("Успешно отправлено");
    submitButton.setAttribute('disabled', 'true');
    //после отправки кнопка снова задизейблена чтобы скрыть прелоадер кнопки
    form.querySelector('.submit-spinner').classList.add('submit-spinner_hide');
  }

  async function enableSubmitButton() {
    submitButton.removeAttribute("disabled");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    sendData();
    // после отправки появляется прелоадер кнопки
    form.querySelector('.submit-spinner').classList.remove('submit-spinner_hide');
  }

  form.addEventListener("submit", handleSubmit);

  //проверка на изменения в форме
  form.addEventListener("change", (event) => {
    if (!isFormValid) {
      isFormValid = true;
      enableSubmitButton();
    }
  });

  fetchData();
});
