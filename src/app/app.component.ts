import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'EMPANGULAR';
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  employeeForm: FormGroup;
  employees: Employee[];
  employeesToDisplay: Employee[];
  educationOptions = [
    'B.tech',
    'M.tech',
    'PhD',
  ];
  constructor(private fb:FormBuilder, private employeeService: EmployeeService){
    this.employeeForm=fb.group({
      
    })
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }






  
  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control(''),
      lastname: this.fb.control(''),
      birthday: this.fb.control(''),
      gender: this.fb.control(''),
      education: this.fb.control('default'),
      jobExperience: this.fb.control(''),
      salary: this.fb.control(''),
    });
    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    });
}

public get FirstName(): FormControl {
  return this.employeeForm.get('firstname') as FormControl;
}
public get LastName(): FormControl {
  return this.employeeForm.get('lastname') as FormControl;
}
public get BirthDay(): FormControl {
  return this.employeeForm.get('birthday') as FormControl;
}
public get Gender(): FormControl {
  return this.employeeForm.get('gender') as FormControl;
}
public get Education(): FormControl {
  return this.employeeForm.get('education') as FormControl;
}

public get JobExperience(): FormControl {
  return this.employeeForm.get('jobExperience') as FormControl;
}
public get Salary(): FormControl {
  return this.employeeForm.get('salary') as FormControl;
}
clearForm() {
  this.fileInput.nativeElement.value = '';
  this.FirstName.setValue('');
  this.LastName.setValue('');
  this.BirthDay.setValue('');
  this.Gender.setValue('');
  this.Education.setValue('');
  this.JobExperience.setValue('');
  this.Salary.setValue('');
  
}  


addEmployee() {
  let employee: Employee = {
    profile: this.fileInput.nativeElement.files[0]?.name,
    firstname: this.FirstName.value,
    lastname: this.LastName.value,
    birthdate: this.BirthDay.value,
    gender: this.Gender.value,
    education: this.educationOptions[parseInt(this.Education.value)],
    jobExperience: this.JobExperience.value,
    salary: this.Salary.value,
    
  };
  this.employeeService.postEmployee(employee).subscribe((res)=>{
    this.employees.unshift(res);
    this.clearForm();
  });
  
}
setForm(emp: Employee) {
  this.FirstName.setValue(emp.firstname);
  this.LastName.setValue(emp.lastname);
  this.BirthDay.setValue(emp.birthdate);
  this.Gender.setValue(emp.gender);

  let educationIndex = 0;
  this.educationOptions.forEach((val, index) => {
    if (val === emp.education) educationIndex = index;
  });
  this.Education.setValue(educationIndex);
  this.JobExperience.setValue(emp.jobExperience);
  this.Salary.setValue(emp.salary);
  this.fileInput.nativeElement.value = '';
}
removeEmployee(event: any) {
  this.employees.forEach((val, index) => {
    if (val.id === parseInt(event)) {
      this.employeeService.deleteEmployee(event).subscribe((res) => {
        this.employees.splice(index, 1);
      });
    }
  });
}
editEmployee(event: any) {
  this.employees.forEach((val, ind) => {
    if (val.id === event) {
      this.setForm(val);
    }
  });
  this.removeEmployee(event);
  this.addEmployeeButton.nativeElement.click();
}
searchEmployees(event: any) {
  let filteredEmployees: Employee[] = [];

  if (event === '') {
    this.employeesToDisplay = this.employees;
  } else {
    filteredEmployees = this.employees.filter((val, index) => {
      let targetKey = val.firstname.toLowerCase() + '' + val.lastname.toLowerCase();
      let searchKey = event.toLowerCase();
      return targetKey.includes(searchKey);
    });
    this.employeesToDisplay = filteredEmployees;
  }
}

}
