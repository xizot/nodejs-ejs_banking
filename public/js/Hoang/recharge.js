
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
        const displayName = $('#txtDisplayName').val();
        const money = $('#txtMoney').val();
        const currencyUnit = $('#currencyUnit').val();
        const bankCode = $('#bankCode').val();
        const stk = $('#txtCardNumber').val();
        const note = $('#txtNote').val();


        if (!money || !currencyUnit || !bankCode || !stk || !displayName || !note) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        var tmp = money;
        if (currencyUnit == "VND") {
            tmp = money * (1 / 23000);
        }

        const newObj = {
            money: money,
            currencyUnit: currencyUnit,
            bankCode: bankCode,
            stk: stk,
            note: note,
        }

        $('.error').remove();
        $.get("api/account/info", function (data, textStatus, jqXHR) {

            if (!data) {
                addError('Tài khoản chưa có tài khoản ngân hàng <a href="/">Thêm tài khoản</a>');
            }
            else if (data.isActive == 0) {
                addError('Tài khoản đã bị khóa');
            }
            else if (Number(data.balance) < Number(tmp)) {
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
                        if (data == '1') {
                            const activity = {
                                stk,
                                money,
                                currencyUnit
                            }
                            localStorage.setItem('activityTransfer', JSON.stringify(activity));
                            $(location).attr('href', '/transfer-success');
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