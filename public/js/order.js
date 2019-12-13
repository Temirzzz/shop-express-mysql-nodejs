document.querySelector('#lite-shop-order').onsubmit = (event) => {
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();
    let rule = document.querySelector('#rule').checked;

    if (!rule) {
        //  спрвилами не согласен
        Swal.fire({
            title: 'Warning',
            text : 'Read and accept the rules',
            type : 'info',
            confirmButtonText : 'Ok'
        });
        return false;
    }

    if (username == '' || phone == '' || email == '' || address =='') {
         // не заполненны поля
        Swal.fire({
            title: 'Warning',
            text : 'Fill all fields',
            type : 'info',
            confirmButtonText : 'Ok'
        });
        return false;
    }

    fetch('/finish-order', {
        method : 'POST',
        body   : JSON.stringify({
            'username' : username,
            'phone'    : phone,
            'address'  : address,
            'email'    : email,
            'key'      : JSON.parse(localStorage.getItem('cart')) 
        }),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then((response) => {
        return response.text();
    })
    .then((body) => {
        if (body == 1) {
            Swal.fire({
                title: 'Success',
                text : 'Success',
                type : 'info',
                confirmButtonText : 'Ok'
            });
        }
        else {
            Swal.fire({
                title: 'Problem with email',
                text : 'Error',
                type : 'Error',
                confirmButtonText : 'Ok'
            });
        }
    })
}