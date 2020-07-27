// //write js here



// $(function () {

//     const addBtnNumPage = (num) => {
//         $(`<li ${num == 0 ? "class='active'" : ""}>
//             <a href=""><button class="btn">${num}</button></a>
//             </li>
//         `).appendTo('.pagination ul');
//     }
//     const getLength = () => {
//         $.get("/news/api/all",
//             function (data, textStatus, jqXHR) {
//                 const len = data.length % 8 == 0 ? parseInt(data.length / 8) : parseInt(data.length / 8) + 1;

//                 $('.pagination ul').empty();
//                 for (let i = 0; i < len; i++) {
//                     addBtnNumPage(i);
//                 }
//             },
//         );
//     }
//     const addTask = task => {
//         if ($('.task-list')) {
//             $(`
//             <li>
//                 <div class="task-list__item row" id ="${task.id}">
//                     <input type="checkbox" name="" id="status" class="col-xs-2 done" ${task.isdone ? "checked" : " "}>
//                     <p class="col-xs-8" task-name">${task.taskname}</p>
//                     <span class="delete col-xs-2"><i class="far fa-trash-alt"></i></span>
//                 </div>
//             </li>
//        `).appendTo('.task-list');
//         }
//     }
//     const renderTask = (tasklist) => {
//         tasklist.forEach(item => {
//             addTask(item);
//         })
//     }
//     const getData = () => {
//         $.ajax({
//             type: "get",
//             url: "/api/task",
//             data: "",
//             contentType: 'application/json',
//             success: function (response) {
//                 if (response) {
//                     renderTask(response);
//                 }
//             }
//         });
//     }

//     //Add Task
//     $('.btn-add-task').click(function (e) {
//         const task = $('#task').val();

//         if (task) {
//             e.preventDefault();
//             $.ajax({
//                 type: "post",
//                 url: "/api/task",
//                 data: JSON.stringify({ "taskname": task }),
//                 contentType: 'application/json',
//                 success: function (response) {
//                     // console.log(response);
//                     addTask(response);
//                 }
//             });
//         }

//     })
//     //Done
//     $(document).on('click', '.done', function (e) {
//         const id = $(this).parent().attr('id');
//         const checked = $(this).prop('checked');

//         if (checked == true) {
//             $.ajax({
//                 type: "POST",
//                 url: "/api/update/" + id,
//                 data: "temp",
//                 ContentType: "text",
//                 success: function (response) {

//                 }
//             });
//         }
//         else {
//             e.preventDefault();
//         }
//     })
//     //Delete
//     $(document).on('click', '.delete', function () {
//         const id = $(this).parent().attr('id');
//         $.ajax({
//             type: "POST",
//             url: "/api/delete/" + id,
//             data: "temp",
//             ContentType: "text",
//             success: function (response) {

//             }
//         });
//         $(this).parent().remove();
//     });
//     setInterval(() => {
//         const height = $('.task-list').height();
//         if (height >= 200) {
//             $('.task-list').css('overflow-x', 'hidden');
//             $('.task-list').css('overflow-y', 'scroll');
//         }
//         else {
//             $('.task-list').css('overflow', 'hidden');

//         }
//     }, 1000)
//     const news = $(".news");


//     const renderNews = (newItem) => {
//         $(`<div class="news__content-item col-xs-6 col-md-3">
//         <div class="gutter">
//             <div class="image">
//                 ${newItem.image}
//             </div>
//             <div class="news__content-item__title">
//                 <a href=" ${newItem.link}">
//                     <h3> ${newItem.title}</h3>
//                 </a>
//             </div>
//             <div class="date">
//                 <span> ${newItem.date}</span>
//             </div>
//             <div class="news__content-item__content">
//                 <p> ${newItem.content}</p>
//             </div>
//         </div>
//     </div>
//         `).appendTo('.news__content');
//     }
//     if (news.length > 0) {
//         getLength();
//         $.get("/news/api",
//             function (data, textStatus, jqXHR) {
//                 $(".news__content").empty();
//                 data.forEach(item => {
//                     renderNews(item);
//                 })
//             },
//         );

//         $(document).on('click', '.pagination ul li', function (e) {
//             e.preventDefault();
//             $('.pagination ul li').removeClass('active');
//             const page = $(this).text();
//             $(this).addClass('active');
//             $.get("/news/api/" + page,
//                 function (data, textStatus, jqXHR) {
//                     $(".news__content").empty();
//                     data.forEach(item => {
//                         renderNews(item);
//                     })
//                 },
//             );
//         });
//     }
// });