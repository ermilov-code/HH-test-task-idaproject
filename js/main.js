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
        // Добавление маски разделения тысячных пробелом для поля цены.
        this.price = el.price.toLocaleString();
        // this.price = el.price;
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
    <button data-id="${this.id}" type="button" class="card-product__delete-button">
    </button>
</article>
			`
    }
}

const list2 = {
    // в этом списке каталога товаров ProductsList - каждый элемент является объектом класса ProductItem
    productList: Item,
};

let products = new productList();


// Разработка функционала добавления товара в общий список из формы:
document.getElementById('button10').addEventListener('click', e => {
    if (!new Validator('product-form').valid) {
        e.preventDefault();
    } else {
        class itemForm {
            constructor() {
                this.title = document.getElementById('name').value;
                this.description = document.getElementById('productDescription').value;
                // Добавление маски разделения тысячных пробелом для поля цены. 
                this.price = (+document.getElementById('price').value).toLocaleString();
                this.id = products['goods'].length + 3;
                this.img = document.getElementById('link').value;
            }

            render() {
                return `
        <article class="card-product card-product_none" data-id="${this.id}">
            <img src="${this.img}" alt="${this.title}" class="card-product__img" width="332" height="200">
            <div class="card-product__content-wrap">
            <h3 class="card-product__name">${this.title}</h3>
            <p class="card-product__description">
                    ${this.description}
            </p>
            <span class="card-product__price">${this.price} руб.</span>
            </div>
            <!-- /.card-product__content-wrap -->
            <button data-id="${this.id}" type="button" class="card-product__delete-button">
            </button>
        </article>
                    `
            }
        }

        let itemFormObj = new itemForm();
        // itemFormObj['price'].toLocaleString();
        products['goods'].push(itemFormObj)
        products['allProducts'].push(itemFormObj)

        // document.querySelector(".section-goods").insertAdjacentHTML('beforeend', itemFormObj.classList.add('elementDelAnim'));

        document.querySelector(".section-goods").insertAdjacentHTML('beforeend', itemFormObj.render());

        // setTimeout(() => {
        //     document.querySelector(".section-goods").insertAdjacentHTML('beforeend', itemFormObj.render());
        // }, 1000);

        // document.querySelector(".section-goods").insertAdjacentHTML('beforeend', itemFormObj.classList.add('elementDelAnim'));

        // очистка формы 
        document.getElementById('product-form').reset();
    }
})


// Добавление функционала удаления товара из списка:
document.querySelector('.section-goods').addEventListener('click', e => {

    if (e.target.classList.contains('card-product__delete-button')) {
        console.log(e.target.dataset['id']);
        // из нашего массива объектов удалили объект 
        products['goods'].splice(products['goods'].indexOf(e.target.dataset['id']), 1);
        products['allProducts'].splice(products['allProducts'].indexOf(e.target.dataset['id']), 1);

        setTimeout(() => {
            // затем удаляем его визуально из верстки 
            document.querySelector(`.card-product[data-id="${e.target.dataset['id']}"]`).remove();
        }, 1000);

        document.querySelector(`.card-product[data-id="${e.target.dataset['id']}"]`).classList.add('elementDelAnim');

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