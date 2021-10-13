class MySelect {
    constructor(target, params) {
        this.element = typeof target === 'string' ? document.querySelector(target) : target;
        this.data = params.data;
        this.element.classList.add("my-select");
        this.element.innerHTML = MySelect.template(this.data);
        this.elInput = this.element.querySelector('[data-select="input"]');
        this.elasticItems = this.element.querySelectorAll(".my-select__list li");
        this.element.addEventListener('click', this.onClick.bind(this));
        this.elInput.addEventListener('input', this.onInput.bind(this));
    }

    onClick(e) {
        const target = e.target;
        const type = target.closest("[data-select]").dataset.select;
        switch (type) {
            case 'toggle':
                this.toggle();
                break;
            case 'input':
                this.show();
                break;
            case 'option':
                this.changeValue(target);
                break;
        }
    }

    onInput(e) {
        const target = e.target;
        const type = target.closest("[data-select]").dataset.select;
        if (type === 'input') {
            let val = target.value.trim();
            let elasticItems = this.elasticItems;

            if (val != '') {
                elasticItems.forEach(function (elem) {
                    if (elem.innerText.toLowerCase().search(val.toLowerCase()) == -1) {
                        elem.classList.add("hide");
                    } else {
                        elem.classList.remove("hide");
                    }
                });
            } else {
                elasticItems.forEach(function (elem) {
                    elem.classList.remove("hide");
                });
            }
        }
    }

    update(option) {
        const selected = this.element.querySelector(".selected");
        if (selected) {
          selected.classList.remove("selected");
        }
        option.classList.add("selected");
        this.elInput.value = option.dataset['value'];
        return option.dataset['value'];
    }

    reset() {
        const selected = this.element.querySelector(".selected");
        if (selected) {
          selected.classList.remove("selected");
        }
        this.element.dispatchEvent(new CustomEvent('select.change'));
        return '';
    }

    changeValue(option) {
        if (option.classList.contains("selected")) {
          return;
        }
        this.update(option);
        this.hide();
    }

    show() {
        document.querySelectorAll(".my-select__list").forEach(select => {
            select.classList.remove("active");
        });
        this.element.classList.add("active");
        this.elasticItems.forEach(function(select) {
            select.classList.remove("hide");
        });
    }

    hide() {
        this.element.classList.remove("active");
        const selected = this.element.querySelector(".selected");
        if (selected) {
            this.elInput.value = selected.innerText;
            this.elInput.setAttribute("data-val", this.elInput.value);
        } else {
            this.elInput.value = "";
            this.elInput.removeAttribute("data-val");
        }
    }

    toggle() {
        if (this.element.classList.contains("active")) {
            this.hide();
        } else {
            this.show();
        }
    }

    dispose() {
        this.element.removeEventListener('click', this._onClick);
    }
}

MySelect.template = params => {
    let items = [];
    params.forEach((option) => {
        items.push(`<li data-value="${option.label}" data-select="option" class="select">${option.label}</li>`);
    });

    return `<div class="my-select__header">
                <input type="text" class="my-select__input" data-select="input" data-val="" name="" id="">
                <button class="my-select__toggle" data-select="toggle" aria-label="Открыть список">▼</button>
            </div>
            <ul class="my-select__list">${items.join('')}</ul>`;
};

function clearTempData() {
    let input = document.querySelectorAll('[data-select="input"]');
    document.querySelectorAll(".my-select").forEach(function(select, i) {
        select.classList.remove("active");
        input[i].value = input[i].getAttribute("data-val");

        position(select);
    });
    
}

function position(target) {
    let targetPosition = window.pageYOffset + target.getBoundingClientRect().bottom;
    let windowPosition = window.pageYOffset + document.documentElement.clientHeight;

    if (targetPosition > windowPosition - 250) {
        target.classList.add("pos-top");
    } else {
        target.classList.remove("pos-top");
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.my-select')) {
        clearTempData();
    }
});

window.addEventListener(`resize`, event => {
    clearTempData();
}, false);

window.addEventListener('scroll', function() {
    clearTempData();
});

