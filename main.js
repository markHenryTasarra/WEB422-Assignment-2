/********************************************************************************* *  
 * WEB422 – Assignment 2 *
 *   I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
 *   No part of this assignment has been copied manually or electronically from any other source *
 *   (including web sites) or distributed to other students. *
 *   Name: Mark-Henry Tasarra Student ID: 065360125 Date: February 1, 2019 * *
 *  ********************************************************************************/ 

//Uses moment and lodash

$(document).ready(function () {
    console.log(`jQuery working!`);
    let employeesModel = [];
    initializeEmployeesModel();

    //Wiring up of keyup event
    $("#employee-search").on("keyup", function () {
        let filteredEmployees = getFilteredEmployeesModel(this.value);
        refreshEmployeeRows(filteredEmployees);
    });

    $(document.body).on("click", ".body-row", function () {
        let employee = getEmployeeByModelById($(this).attr("data-id"));
        if (employee != null) {
            employee.HireDate = moment(employee.HireDate).format('LL');
            let modalContentTemplate = _.template(
                `<strong>Address:</strong> <%- employee.AddressStreet %> <%- employee.AddressCity %>, <%- employee.AddressState %>. <%- employee.AddressZip %></br>
                <strong>Phone Number:</strong> <%- employee.PhoneNum %> ext: <%- employee.Extension %></br>
                <strong>Hire Date:</strong> <%- employee.HireDate %>`
            );
            let modalContent = modalContentTemplate({ 'employee': employee });
            showGenericModal(`<strong>${employee.FirstName} ${employee.LastName}</strong>`, modalContent);
        };
    });
});

initializeEmployeesModel = ()  => {
    $.ajax({
        url: "https://fierce-eyrie-59581.herokuapp.com/employees",
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        employeesModel = data;
        refreshEmployeeRows(employeesModel);
    }).fail(function () {
        showGenericModal('Error', 'Unable to get Employees');
    });
}

showGenericModal = (title, message) => {
    $("#genericModal .modal-title").empty().append(title);//Might be .empty()
    $("#genericModal .modal-body").empty().append(message);
    $("#genericModal").modal('show');
}

refreshEmployeeRows = (employees) => {
    $("#employees-table").empty();
    let employeeTemplate = _.template(
    `<% _.forEach(employees, function(employee){%>
    <div class="row body-row" data-id="<%- employee._id %>">
    <div class="col-xs-4 body-column"><%- _.escape(employee.FirstName) %></div>
    <div class="col-xs-4 body-column"><%- _.escape(employee.LastName) %></div>
    <div class="col-xs-4 body-column"><%- _.escape(employee.Position.PositionName) %></div>
    </div>
    <% }); %>`);
    $("#employees-table").append(employeeTemplate({"employees" : employees}));
}

getFilteredEmployeesModel = (filterString) => {//Might have to assign a var to _.filter and return that
    let fitler = _.filter(employeesModel, function (e) {
        if (e.FirstName.toLowerCase().includes(filterString.toLowerCase()) ||
            e.LastName.toLowerCase().includes(filterString.toLowerCase()) ||
            e.Position.PositionName.toLowerCase().includes(filterString.toLowerCase())) 
            return true;
        else
            return false;
    });
    return fitler;
}

getEmployeeByModelById = (id) => {
    let temp = null;
    $.grep(employeesModel, function (employee, i) {
        if (employee._id == id)
            temp = _.cloneDeep(employee);
            else
            return temp;
    });
    return temp;
}