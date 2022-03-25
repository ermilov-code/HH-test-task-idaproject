// ============================================================
class Validator {

    constructor(form) {

        this.patterns = {
            name: /^[a-zа-яё]+$/i,
            link: /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/,
            price: /\d{2,15}/,
        };
        this.errors = {
            name: 'Имя содержит только буквы',
            link: 'Формат link: http://ааааааааа.ru/',
            price: 'Формат price: 100000'
        };
        this.errorClass = 'error-msg';
        this.form = form;
        this.valid = false;
        this._validateForm();
    }
    validate(regexp, value) {
        regexp.test(value)
    }

    _validateForm() {
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors) {
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).getElementsByTagName('input')];
        for (let field of formFields) {
            this._validate(field);
        }
        if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
            this.valid = true;
            // удалить лишнее
            document.getElementById('button10').removeAttribute('disabled');
        }
    }

    _validate(field) {
        if (this.patterns[field.name]) {
            if (!this.patterns[field.name].test(field.value)) {
                field.classList.add('invalid');
                this._addErrorMsg(field);
                this._watchField(field);
                // удалить лишнее
                this._buttonActivation(field);
                document.getElementById('button10').setAttribute('disabled', true);
            }
        }
    }
    _addErrorMsg(field) {
        let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `;
        field.parentNode.insertAdjacentHTML('beforeend', error);
    }
    _watchField(field) {
        field.addEventListener('input', () => {
            let error = field.parentNode.querySelector(`.${this.errorClass}`);
            if (this.patterns[field.name].test(field.value)) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                if (error) {
                    error.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if (!error) {
                    this._addErrorMsg(field);
                }
            }
        })
    }
    // необходимо сделать метод, который будет отслеживать каждое изменение в обязательных полях ввода (кнопка добавления товара неактивна пока форма пуста или невалидна)
    _buttonActivation(field) {
        field.addEventListener('input', () => {
            if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
                // делает кнопку активной, если хотя одно поле валидно 
                document.getElementById('button10').removeAttribute('disabled');
                document.getElementById('button10').classList.add('valid-form-btn');
            }
        })
    }

}

// ============================================================


// DROP-DOWN MENU:

const selectSingle = document.querySelector('.select');
const selectSingle_title = selectSingle.querySelector('.select__title');
const selectSingle_labels = selectSingle.querySelectorAll('.select__label');

selectSingle_title.addEventListener('click', () => {
    if ('active' === selectSingle.getAttribute('data-state')) {
        selectSingle.setAttribute('data-state', '');
    } else {
        selectSingle.setAttribute('data-state', 'active');
    }
});

for (let i = 0; i < selectSingle_labels.length; i++) {
    selectSingle_labels[i].addEventListener('click', (evt) => {
        selectSingle_title.textContent = evt.target.textContent;
        selectSingle.setAttribute('data-state', '');
    });
}

// DROP-DOWN MENU /




// ============================================================