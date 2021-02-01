import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentsServicesService } from '../../services/incidents-services.service';

@Component({
  selector: 'app-incident-edit',
  templateUrl: './incident-edit.component.html',
  styleUrls: ['./incident-edit.component.css']
})
export class IncidentEditComponent implements OnInit {
  updateForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    date_Logged: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(''),
    statusId: new FormControl(''),
    //incident_Technician_ID: new FormControl(''),
    userId: new FormControl('')
  });
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  constructor(
    public dialog: MatDialog, 
    public matProgres: MatProgressSpinnerModule, 
    public formField: MatFormFieldModule, 
    public matCard: MatCardModule, 
    private incidentService: IncidentsServicesService, 
    private formBuilder: FormBuilder, 
    private avRoute: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    
    this.getIncident(this.avRoute.snapshot.params['id']);
  }
  getIncident(id: number)
  {
    this.incidentService.getIncident(id).subscribe(data => {
      console.log(data);
      this.updateForm.controls.id.setValue(data.id);
      this.updateForm.controls.location.setValue(data.location);
      this.updateForm.controls.description.setValue(data.description);
      this.updateForm.controls.date_Logged.setValue(data.date_Logged);
      this.updateForm.controls.statusId.setValue(data.statusId);
      //this.updateForm.controls.incident_Technician_ID.setValue(data.incident_Technician_ID);
      this.updateForm.controls.userId.setValue(data.userId);
    });
  }
  onFormSubmit(form: FormGroup)
  {
    console.log(this.updateForm.value);
    
    this.isLoadingResults = true;
    // form.controls.incident_Description.setValue('Broken chair');
    this.incidentService.updateIncident(this.updateForm.value.id, form.value)
    .subscribe(res => {
      this.isLoadingResults = false;
      alert('Success');
      this.router.navigate(['/home']);
    }, (err) =>
    {
      console.log(err);
      this.isLoadingResults= false;
    });
  }


}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
