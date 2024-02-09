Admin.Modules.register('form.elements.text', () => {

//     Пока только для первого элемента, без перебора
    let el = document.getElementsByClassName('form-element-text')
// document.querySelectorAll('.Qty').forEach( (x) => { x.value = '100' } )

    if (el && el[0]) {
        let area = el[0]

        let field = area.getElementsByClassName('text-element')[0]

        // Генерация текста
        let BTN = area.getElementsByClassName('generate')

        if(BTN && BTN[0]) {
            let generateBTN = BTN[0]
            if(generateBTN && field) {
                generateBTN.addEventListener('click', () => {
                    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    if (field.dataset.generateChars) {
                        chars = field.dataset.generateChars
                    }
                    var textLength = field.dataset.generateLength;
                    var textGenerated = '';
                    for (var i = 1; i <= textLength; i++) {
                        var randomNumber = Math.floor(Math.random() * chars.length);
                        textGenerated += chars.substring(randomNumber, randomNumber +1);
                    }
                    field.value = textGenerated
                })
            }
        }
    }

})
