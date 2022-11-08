Admin.Modules.register('form.elements.password', () => {

//     Пока только для первого элемента, без перебора
    let el = document.getElementsByClassName('password-field')
// document.querySelectorAll('.Qty').forEach( (x) => { x.value = '100' } )

    if (el && el[0]) {
        let area = el[0]

        let showBTN = area.getElementsByClassName('button-show')[0]
        let field = area.getElementsByClassName('passwd')[0]

        // Показать/скрыть пароль
        if (showBTN && field) {
            showBTN.addEventListener('click', () => {
                if(field.type === 'password') {
                    field.type = 'text'
                    showBTN.getElementsByTagName('i')[0].className = 'fa-solid fa-eye-slash'
                } else {
                    field.type = 'password'
                    showBTN.getElementsByTagName('i')[0].className = 'fa-solid fa-eye'
                }
            })
        }

        // Генерация пароля
        let BTN = area.getElementsByClassName('generate')

        if(BTN && BTN[0]) {
            let generateBTN = BTN[0]
            if(generateBTN && field) {
                generateBTN.addEventListener('click', () => {
                    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    var passwordLength = field.dataset.generateLength;
                    var password = '';
                    for (var i = 1; i <= passwordLength; i++) {
                        var randomNumber = Math.floor(Math.random() * chars.length);
                        password += chars.substring(randomNumber, randomNumber +1);
                    }
                    field.value = password
                })
            }
        }
    }

})
