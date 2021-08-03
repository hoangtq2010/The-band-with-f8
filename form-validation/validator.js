
// Constructor Validator
function Validator (options) {

    function getParent (element, selector) {
        while (element.parentElement)     //.matches() : check css selector(xem co id,class)
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
    } 

    var selectorRules = {}

    //func hiện ra lỗi or bỏ lỗi đi
    function validate (inputElement, rule) {

        // value : inputElement.value
        // test func: rule.test
        var errorMessage //  = rule.test(inputElement.value) //inputElement.value: lấy đối số ta nhập vào input
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector) //trỏ vào chính form-message của input 

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule & kiêm tra
        // Nếu có lỗi thì dừng kiểm tra để xử lý
        for (var i = 0; i < rules.length; ++i){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i]( formElement.querySelector(rule.selector + ':checked'))
                    break
                default: 
                    errorMessage = rules[i](inputElement.value)

            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage;  //! thành true or false
    }

    var formElement = document.querySelector(options.form)     //Lấy element của form cần validate (form-1)
    
    if (formElement) {
        
        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault()

            var isFormValid = true;
            // Lặp qua từng rule và validate
            options.rules.forEach( (rule) => {  
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate (inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            })
            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce( (values, input) => {

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name +'"]:checked').value
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value);
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default: 
                                values[input.name] = input.value
                        }
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit()
                }
            }
        }

        // Lặp qua mỗi rule và xử lý(event: blur, input, ...) 
        options.rules.forEach( (rule) => {  
            
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelectorAll(rule.selector)  //vào input trong cái form, đi từ formElement
            Array.from(inputElements).forEach((inputElement) => {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate (inputElement, rule)
                }        

                // Xử lý mỗi khi người dùng nhập input (xóa invalid)
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector) 

                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })

        })
    }    
} 


//Định nghĩa rules
// Nguyên tắc rules:
// 1.Khi có lỗi => trả mess lỗi
// 2.Khi hợp lệ => không trả gì cả (undefined)
Validator.isRequired = function (selector, mess) {
    return {
        selector : selector,
        test : function(value){  //function để kiểm tra bắt buộc phải nhập(value: giá trị ta nhập vào)
            return value ? undefined : mess || 'Hãy nhập trường này'     //.trim() loại bỏ dấu cách 2 bên đầu input
        }
    }
    

}

Validator.isEmail = function (selector, mess) {
    return {
        selector : selector,
        test : function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : mess || 'Trường này phải là email '
        }
    }
}

Validator.minLength = function (selector, min, mess) {
    return {
        selector : selector,
        test : function(value){
            return value.length >= min ? undefined : mess || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, mess) {
    return {
        selector : selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : mess || 'Giá trị nhập vào không chính xác'
        }
    }
}


