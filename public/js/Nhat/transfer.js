
var socket = io("http://localhost:5000");

const addError = content => {
    $(`
    <div class="form-group mt-10 error">
    <p class="red">* ${content}</p>
</div>
    `).appendTo('form');
}
$(function () {
    $('#btnContinue').click(async function (e) {
        e.preventDefault();
        // http://localhost:5000/api/account/info

        const money = $('#txtMoney').val();
        const currencyUnit = $('#currencyUnit').val();
        const bankCode = $('#bankCode').val();
        const stk = $('#txtCardNumber').val();
        const message = $('#txtMessage').val();


        if (!money || !currencyUnit || !bankCode || !stk || !message) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const newObj = {
            money: money,
            currencyUnit: currencyUnit,
            bankCode: bankCode,
            stk: stk,
            message: message,
        }

        $('.error').remove();
        $.get("api/account/info", function (data, textStatus, jqXHR) {

            console.log(data);
            if (Number(data.balance) < Number(money)) {
                addError('Số dư tài khoản không đủ');
            }
            else {

                $.post("api/account/addMoney", newObj,
                    function (data, textStatus, jqXHR) {
                        if (data == '-1') {
                            addError('Không thể gửi tiền cho chính mình');
                        }
                        if (data == '-2') {
                            addError('Lỗi không xác định');
                        }
                        if (data == '0') {
                            addError('Số tài khoản và ngân hàng không hợp lệ');
                        }
                    },
                );
                // console.log('Số dư tài khoản đủ');
            }
            return;
        },
        );




        // $.post("/api/account/addMoney", newObj,
        //     function (data, textStatus, jqXHR) {
        //         console.log(data);

        //         // console.log($(location).attr('href', '/transfer-success'));

        //     },
        // );

        socket.emit("transfer", newObj);
    })
});
socket.on("server-said", data => {
    //demo
    $('#txtCardNumber').val(data);
});