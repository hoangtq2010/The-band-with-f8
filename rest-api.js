

var courseApi = 'http://localhost:3000/courses'


function start() {
    getCourses(renderCourses);
    handleCreateForm();
}

start()

// Render Courses
function getCourses(callback) {
    fetch(courseApi)
        .then(response => response.json())     //la 1 promise
        .then(callback);          //callback = function(response){} , se tra ve 1 array la tat ca [obj,obj,...]
}
function renderCourses(courses){
    var listCoursesBlock = document.querySelector('#list-course')
    var htmls = courses.map(function(course){
        return `
        <li class="course-item-${course.id}">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <button onclick="handleDeleteCourse(${course.id})">Xoa</button>
        </li>`
    })
    listCoursesBlock.innerHTML = htmls.join('')
}

// CreateCourse
function createCourse(data,callback) {
    var options = {
        method : 'POST',
        body : JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    fetch(courseApi, options)
        .then(response => response.json)
        .then(callback)
}

function handleCreateForm(){
    var createBtn = document.querySelector('#create')
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="name"]').value
        var description = document.querySelector('input[name="description"]').value
        
        var formData = {
            name : name,
            description : description
        }
        createCourse(formData, function(){
            getCourses(renderCourses)
        })
    }
}

// Delete course
function handleDeleteCourse(id) {
    var options = {
        method : 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    fetch(courseApi + '/' + id, options)
        .then(response => response.json)
        .then(function(){
            var courseItem = document.querySelector('.course-item-' + id);  
            if(courseItem) {
                courseItem.remove()
            }
        })
}


