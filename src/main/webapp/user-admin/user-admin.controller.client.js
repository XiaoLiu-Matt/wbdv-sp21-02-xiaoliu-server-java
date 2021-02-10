var $usernameFld, $passwordFld;
var $firstNameFld, $lastNameFld, $roleFld;
var $removeBtn, $editBtn, $createBtn;
var $userRowTemplate, $tbody;
var userService = new AdminUserServiceClient();


var users = [
    // {username: "CS1", password: "", firstname: 23, lastname: "Spring",role: "FACULTY"},
    // {username: "CS2", password: "", firstname: 23, lastname: "Spring",role: "FACULTY"},
    // {username: "CS3", password: "", firstname: 23, lastname: "Spring",role: "FACULTY"},
    // {username: "CS4", password: "", firstname: 23, lastname: "Spring",role: "STUDENT"},
    // {username: "CS5", password: "", firstname: 23, lastname: "Spring",role: "ADMIN"},
]
function renderUsers(users) {
    $tbody.empty()
    for(var i=0; i<users.length; i++) {
        var user = users[i]
        $tbody
            .prepend(`
      <tr>
          <td class="wbdv-username">${user.username}</td>
            <td class ="wbdv-password"> &nbsp</td>
            <td class="wbdv-first-name">${user.firstname}</td>
            <td class="wbdv-last-name">${user.lastname}</td>
            <td class="wbdv-role">${user.role}</td>
            <td class="wbdv-actions">
        <span class="pull-right">
          <i id = "${i}" class="fa-2x fa fa-times wbdv-remove"></i>
          <i id = "${user._id}" class="fa-2x fa fa-pencil wbdv-edit"></i>
        </span>
            </td>
      </tr>
      `)
    }
    $removeBtn = $(".wbdv-remove")
    $removeBtn.click(deleteUser)

    $editBtn = $(".wbdv-edit")
    $editBtn.click(selectUser)
}

var selectedUser = null
function selectUser(event) {
    var selectBtn = jQuery(event.target)
    var theId = selectBtn.attr("id")
    selectedUser = users.find(user => user._id === theId)

    $usernameFld.val(selectedUser.username)
    $passwordFld.val(selectedUser.password)
    $firstNameFld.val(selectedUser.firstname)
    $lastNameFld.val(selectedUser.lastname)
    $roleFld.val(selectedUser.role)
}

function updateUser() {
    selectedUser.username = $usernameFld.val()
    selectedUser.password = $passwordFld.val()
    selectedUser.firstname = $firstNameFld.val()
    selectedUser.lastname = $lastNameFld.val()
    selectedUser.role = $roleFld.val()
    userService.updateUser(selectedUser._id, selectedUser)
        .then(status => {
            var index = users.findIndex(user => user._id === selectedUser._id)
            users[index] = selectedUser
            renderUsers(users)
        })
}

function createUser(){
    var newUser = {
        username: $usernameFld.val(),
        password: $passwordFld.val(),
        firstname: $firstNameFld.val(),
        lastname: $lastNameFld.val(),
        role: $roleFld.val()
    }
    $usernameFld.val("")
    $passwordFld.val("")
    $firstNameFld.val("")
    $lastNameFld.val("")
    userService.createUser(newUser)
        .then(function(actualUser){
            users.push(actualUser)
            renderUsers(users)
        })

}

function deleteUser(event){
    var button = $(event.target)
    var theIndex = button.attr("id")
    var theId = users[theIndex]._id

    userService.deleteUser(theId)
        .then(function (status) {
            users.splice(theIndex, 1)
            renderUsers(users)
        })

}

function main() {
    $tbody = jQuery(".wbdv-tbody")
    $createBtn = $(".wbdv-create")
    $editBtn = $(".wbdv-update")
    //$removeBtn = $(".wbdv-remove")
    $usernameFld = $("#usernameFld")
    $passwordFld = $("#passwordFld")
    $firstNameFld = $("#firstNameFld")
    $lastNameFld = $("#lastNameFld")
    $roleFld = $("#roleFld")

    $createBtn.click(createUser)
    $editBtn.click(updateUser)
    userService.findAllUsers()
        .then(function(actualUsersFromServer){
            users = actualUsersFromServer
            renderUsers(users)
        })

    // renderUsers(users)

}
$(main)