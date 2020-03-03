var inquirer = require('inquirer');
var fs = require('fs');
var util = require('util');
const writeFileSync = util.promisify(fs.writeFile);
const mysql = require('mysql');
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "koustub1995",
    database: "employeeManagementSystem"
});



class Employee {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}
class manager extends Employee {
    constructor(id, name, role, noOfTeamMembers, idsOfTeamMembers) {
        super(id, name, role);
        this.noOfTeamMembers = noOfTeamMembers;
        this.idsOfTeamMembers = idsOfTeamMembers;
    }
}
class intern extends Employee {
    constructor(id, name, role, schoolName, internshipDuration) {
        super(id, name, role);
        this.schoolName = schoolName;
        this.internshipDuration = internshipDuration;
    }
}
class engineer extends Employee {
    constructor(id, name, role, email, gitUsername) {
        super(id, name, role);
        this.email = email;
        this.gitUsername = gitUsername;
    }
}
var Mengineer;
var teamPlayersArr = [];
var managerArr = [];
var engineerArr = [];
var internArr = [];
async function addInformation() {
    console.log('--------------------------------------------');
    console.log('-----****Employee Management System****-----');
    console.log('--------------------------------------------');
    promptAnswers = await inquirer.prompt([
        {
            name: 'action', type: 'list', message: 'Any Information to include in data?',
            choices: ["Add New Department", "Add New Role", "Add New Employee","Display Employees Data","Display Roles Data in Office","Display Departments Informations",'Display Details About Engineers in office','Update Employee Role',"Exit"]
        }
    ]);
    if (promptAnswers.action === 'Add New Employee') { gatherInformation(); }
    else if (promptAnswers.action === 'Add New Department') { gatherDeptInfo(); }
    else if (promptAnswers.action === 'Add New Role') { gatherRoleInfo(); }
    else if (promptAnswers.action === 'Display Employees Data'){DisplayEmployees();}
    else if(promptAnswers.action === 'Display Roles Data in Office'){DisplayRoles();}
    else if(promptAnswers.action == 'Display Departments Informations'){DisplayDepartments();}
    else if(promptAnswers.action === 'Display Details About Engineers in office'){DisplayEngineersInfo();}
    else if(promptAnswers.action === 'Update Employee Role'){UpdateEmployee();}
    else if (promptAnswers.action === 'Exit'){
    console.log('-------------****Thank You****---------------');
    process.exit(0);
    };
}
addInformation();
function gatherInformation() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter Employee first_Name?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Enter Employee last_Name?',
            name: 'last_Name'
        },
        {
            type: 'list',
            message: 'Select the role of the employee',
            name: 'role',
            choices: ["Manager", "Engineer", "Intern"]
        },
        {
            type: 'input',
            message: 'Enter Manager`s id you work under',
            name: 'mngr_id'
        }
    ])
        .then(async function (response) {

            if (response.role == 'Engineer') {
                let roleId = 1;
                await db.query(`INSERT INTO employee(emp_firstname,emp_lastname,role_id,mgr_id)` + `VALUES('${response.first_name}','${response.last_Name}','${roleId}','${response.mngr_id}')`);
                console.log('Insert Successfull');
            }
            else if (response.role == 'Intern') {
                let roleId = 2;
                console.log(`${roleId}`);
                await db.query(`INSERT INTO employee(emp_firstname,emp_lastname,role_id,mgr_id)` + `VALUES('${response.first_name}','${response.last_Name}','${roleId}','${response.mngr_id}')`);
                console.log('Insert Successfull');


            }
            else if (response.role == 'Manager') {
                let roleId = 3;
                await db.query(`INSERT INTO employee(emp_firstname,emp_lastname,role_id,mgr_id)` + `VALUES('${response.first_name}','${response.last_Name}','${roleId}','${response.mngr_id}')`);
                console.log('Insert Successfull');

            }
            addInformation();
        }
        );

}
async function gatherDeptInfo() {
    infoDept = await inquirer.prompt([{
        type: 'input',
        message: 'Enter the Name Of Department',
        name: 'deptName'
    }]);
    await db.query(`INSERT INTO department(dept_name)` + `VALUES('${infoDept.deptName}')`);
    console.log('Insert successfull');
    addInformation();
}

async function gatherRoleInfo() {
    infoRole = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the Name of new role',
            name: 'roleName'
        },
        {
            type: 'input',
            message: 'Enter Salary for this new role',
            name: 'roleSalary'
        },
        {
            type: 'list',
            message: 'Select the role of the employee',
            name: 'roleDept',
            choices: ["Research & Development", "Human Resource Management", "Production"]
        }
    ]);
    if (infoRole.roleDept === 'Research & Development') {
        let infoRoleDept = 1;
        await db.query(`INSERT INTO roles(role_title,role_salary,dept_id)` + `VALUES('${infoRole.roleName}','${infoRole.roleSalary}','${infoRoleDept}')`);
        console.log('Insert successfull');
    }
    else if (infoRole.roleDept === 'Human Resource Management') {
        let infoRoleDept = 2;
        await db.query(`INSERT INTO roles(role_title,role_salary,dept_id)` + `VALUES('${infoRole.roleName}','${infoRole.roleSalary}','${infoRoleDept}')`);
        console.log('Insert successfull');
    }
    else if (infoRole.roleDept === 'Production') {
        let infoRoleDept = 3;
        await db.query(`INSERT INTO roles(role_title,role_salary,dept_id)` + `VALUES('${infoRole.roleName}','${infoRole.roleSalary}','${infoRoleDept}')`);
        console.log('Insert successfull');
    }
    addInformation();
}

async function DisplayEmployees(){
    let EmpData = await db.query(`SELECT * FROM employee`);
    console.table(EmpData);
     addInformation();
}
async function DisplayRoles(){
    let RolesData = await db.query(`SELECT * FROM roles`);
    console.table(RolesData);
     addInformation();
}

async function DisplayDepartments(){
    let DeptData = await db.query(`SELECT * FROM department`);
    console.table(DeptData);
     addInformation();
}

async function DisplayEngineersInfo(){
    let DisplayEngineers = await db.query(`SELECT employee.emp_firstName,employee.emp_lastName,
    roles.role_title,roles.role_salary,department.dept_name FROM
     employee LEFT JOIN roles on (employee.role_id = roles.role_id) 
     LEFT JOIN department on (roles.role_id = department.dept_id)
     where roles.role_title = 'engineer'`);
     console.table(DisplayEngineers);
     addInformation();
}

async  function UpdateEmployee(){
    console.log('update successfull');
     let EmpData = await db.query(`SELECT * FROM employee`);
     console.table(EmpData);
     const empNameToEdit = await inquirer .prompt([{
         type:'input',
         message:'Please Enter Employee first name to update his role',
         name:'empnametorole'
     }]);
     let resEmp = await db.query(`SELECT * from employee WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
     console.table(resEmp);
     const newRole = await inquirer .prompt([{
         type:'list',
         message:`Enter employee's new role`,
         name:'newrole',
         choices: ['engineer','intern','manager','Senior Associate Developer']
     }]);
     if(newRole.newrole == 'engineer'){
        let newUpdatedRole = await db.query(`UPDATE employee SET role_id = 1 WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.log('-------****Update Successfull****-----------');
        console.log('--------------------------------------------');
        console.log('-------**Updated Employee Information**-----');
        let resEmp = await db.query(`SELECT * from employee WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.table(resEmp);
        addInformation();
     }
     else if(newRole.newrole == 'intern'){
        let newUpdatedRole = await db.query(`UPDATE employee SET role_id = 2 WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.log('-------****Update Successfull****-----------');
        console.log('--------------------------------------------');
        console.log('-------**Updated Employee Information**-----');
        let resEmp = await db.query(`SELECT * from employee WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.table(resEmp);
        addInformation();
    }
    else if(newRole.newrole == 'manager'){
        let newUpdatedRole = await db.query(`UPDATE employee SET role_id = 3 WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.log('-------****Update Successfull****-----------');
        console.log('--------------------------------------------');
        console.log('-------**Updated Employee Information**-----');
        let resEmp = await db.query(`SELECT * from employee WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.table(resEmp);
        addInformation();
    }
    else if(newRole.newrole == 'Senior Associate Developer'){
        let newUpdatedRole = await db.query(`UPDATE employee SET role_id = 4 WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.log('-------****Update Successfull****-----------');
        console.log('--------------------------------------------');
        console.log('-------**Updated Employee Information**-----');
        let resEmp = await db.query(`SELECT * from employee WHERE emp_firstName = '${empNameToEdit.empnametorole}'`);
        console.table(resEmp);
        addInformation();
    }
}