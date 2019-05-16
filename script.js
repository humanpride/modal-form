function clearValidationFeedback(input)
{
    // убирает стили для поля input и информацию о валидности данных
    input.classList.remove('is-invalid');
    input.nextSibling.nextSibling.classList.remove('invalid-feedback');
    input.nextSibling.nextSibling.innerHTML = '';
}

function invalidInput(input)
{
    // установка стилей для невалидных данных
    input.classList.add('is-invalid');
    input.nextSibling.nextSibling.classList.add('invalid-feedback');
}

function invalidPhoneNumber(phone)
{
    // проверка номера телефона
    if (phone.search(/^((\+7|8)[- ]?)?(\(?\d{3}\)?[- ]?)?[-\d ]{7,10}$/) == -1) {
        return true;
    } else {
        return false;
    }
}

function checkInputs()
{
    // проверка полей ввода
    var validData = true; // Если проверка успешно пройдена, возвращаем true
    var name = document.getElementById('uname');
    var phone = document.getElementById('phoneNumb');
    
    if (name.value == '') {
        invalidInput(name);
        document.getElementById('nameFeedback').innerHTML = 'Введите, пожалуйста, ваше имя';
        validData = false;
    }
    if (phone.value == '') {
        invalidInput(phone);
        document.getElementById('phoneFeedback').innerHTML = 'Введите, пожалуйста, ваш номер телефона';
        validData = false;
    } else if (invalidPhoneNumber(phone.value)) {
        invalidInput(phone);
        document.getElementById('phoneFeedback').innerHTML = 'Введите, пожалуйста, корректный номер телефона';
        validData = false;
    }

    return validData;
}

function ajaxSend()
{
    // запрос на сохранение данных формы в БД
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            // как только скрывается форма, добавляется сообщение об успешной отправке
            var responseText = this.responseText;
            $('#modalForm').one('hide.bs.modal', function () {
                var successAlert = document.createElement('div');
                successAlert.setAttribute('class', 'modal fade');
                successAlert.setAttribute('id', 'successModal');
                successAlert.setAttribute('tabindex', -1);
                successAlert.setAttribute('role', 'dialog');
                successAlert.setAttribute('aria-labelledby', 'successModalLabel');
                successAlert.setAttribute('aria-hidden', true);
                successAlert.innerHTML = '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="successModalLabel">Спасибо</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="responseDiv"></div></div></div>';
                document.body.appendChild(successAlert);

                // после завершения CSS перехода отображается ответ от сервера
                $('#successModal').on('shown.bs.modal', function () {
                    document.getElementById('responseDiv').innerHTML = responseText;
                });
                $('#successModal').modal('show');

                // после закрытия окна с сообщением, оно удаляется со страницы
                $('#successModal').on('hidden.bs.modal', function () {
                    document.body.removeChild(document.getElementById('successModal'));
                });
            });
            
            $('#modalForm').modal('hide');
        }
    }

    var name = document.getElementById('uname');
    var phone = document.getElementById('phoneNumb');
    var text = document.getElementById('comment');

    xmlhttp.open('POST', 'controller.php', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(
        'name='+name.value+
        '&phone='+phone.value+
        '&text='+text.value
    );

    // очистка всех полей
    name.value = '';
    phone.value = '';
    text.value = '';
}

document.getElementById('submitButton').onclick = function () {
    if (checkInputs()) {
        ajaxSend(); // ajax.js
    }
};
document.getElementById('resetButton').onclick = function () {
    clearValidationFeedback(document.getElementById('uname'));
    clearValidationFeedback(document.getElementById('phoneNumb'));
};
document.getElementById('uname').onkeyup = function () { clearValidationFeedback(this); };
document.getElementById('phoneNumb').onkeyup = function () { clearValidationFeedback(this); };