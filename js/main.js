// ============================================================

// нам нужно создать два класса - один для карточки товара - другой для списка товаров 

// API для каталога 
const API = "https://raw.githubusercontent.com/ermilov-code/HH-test-task-idaproject/main/json"

// класс для списка товаров:
class productList {
    // constructor(url, container, list = list2) {
    constructor(container = '.section-goods', url = "/catalogData.json", list = list2) {
        this.container = container;
        // this.list = list;
        this.url = url;
        this.list = list;
        this.goods = [];
        this.allProducts = [];
        this._init();
        this.getJson()
            .then(data => this.handleData(data)); // handleData запускает отрисовку либо каталога товаров, либо списка товаров корзины
    }

    getJson(url) {
        // : - тернарный оператор - за счет этой конструкции мы делаем конект либо к внешнему файлу - либо к локальному файлу 
        return fetch(url ? url : `${API + this.url}`)
            // json файл преобразуем в объект result => result.json())
            .then(result => result.json())
            // а если не получилось сообщаем об ошибке 
            .catch(error => {
                console.log(error);
            })
        // после вызова getJson - мы получим объект нашей строки json (файла json)
    }

    // принимает массив товаров 
    handleData(data) {
        // массив распаковываем и помещаем в goods 
        this.goods = [...data];
        this.render();
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new this.list[this.constructor.name](product);
            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    _init() {
        return false
    }
}

// класс Item - это общий (базовый) для товара (либо в корзине - либо в каталоге) - 
// общие свойства у любого товара: картинка - цена - id 
// а вот частное свойство - будет количество для корзины
class Item {
    constructor(el) {
        this.title = el.title;
        this.description = el.description;
        this.price = el.price;
        this.id = el.id;
        this.img = el.img;
    }
    // вернем верстку для нашего товара 
    // если у элемента есть дата атрибут (напр - data-id) - то мы можем к ним обращаться через dataset 
    // объект event - target 
    render() {
        return `
<article class="card-product" data-id="${this.id}">
    <img src="${this.img}" alt="${this.title}" class="card-product__img" width="332" height="200">
    <div class="card-product__content-wrap">
    <h3 class="card-product__name">${this.title}</h3>
    <p class="card-product__description">
            ${this.description}
    </p>
    <span class="card-product__price">${this.price} руб.</span>
    </div>
    <!-- /.card-product__content-wrap -->
    <button type="button" class="card-product__delete-button">
    <svg width="16" height="16" class="card-product__btn-img" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 16 16">
        <g fill="#fff" clip-path="url(#clip0_4_349)">
        <path
            d="M10.207 5.797a.375.375 0 0 0-.375.375v7.082a.375.375 0 0 0 .75 0V6.172a.375.375 0 0 0-.375-.375zM5.785 5.797a.375.375 0 0 0-.374.375v7.082a.375.375 0 1 0 .75 0V6.172a.375.375 0 0 0-.376-.375z" />
        <path
            d="M2.563 4.763v9.232c0 .546.2 1.058.55 1.426.347.369.832.578 1.338.579h7.09c.507 0 .991-.21 1.339-.579.35-.368.55-.88.55-1.426V4.763a1.431 1.431 0 0 0-.368-2.814h-1.918V1.48A1.472 1.472 0 0 0 9.66 0H6.333a1.472 1.472 0 0 0-1.484 1.48v.469H2.93a1.432 1.432 0 0 0-.367 2.814zm8.978 10.488h-7.09c-.64 0-1.139-.55-1.139-1.256V4.796h9.368v9.2c0 .704-.498 1.255-1.139 1.255zM5.598 1.48a.721.721 0 0 1 .735-.732H9.66a.722.722 0 0 1 .734.731v.469H5.598V1.48zM2.93 2.697h10.132a.674.674 0 1 1 0 1.349H2.93a.674.674 0 1 1 0-1.35z" />
        <path
            d="M7.996 5.797a.375.375 0 0 0-.375.375v7.082a.375.375 0 0 0 .75 0V6.172a.375.375 0 0 0-.375-.375z" />
        </g>
        <defs>
        <clipPath id="clip0_4_349">
            <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
        </defs>
    </svg>
    </button>
</article>
			`
    }
}

// объект list2 - в нем два свойства 
const list2 = {
    // в этом списке каталога товаров ProductsList - каждый элемент является объектом класса ProductItem
    productList: Item,
};

let products = new productList();







document.getElementById('button10').addEventListener('click', e => {
    if (!new Validator('product-form').valid) {
        e.preventDefault();
    } else {
        let itemForm = {
            id: products['goods'].length + 1,
            title: document.getElementById('name').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('price').value,
            img: document.getElementById('link').value,
        }



        products['goods'].push(itemForm)
        products['allProducts'].push(itemForm)
        products.render()







    }
})



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