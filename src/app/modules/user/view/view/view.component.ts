import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';  
import { Incident, Incidents } from 'src/app/core/models/incident.model';
import { IncidentsServicesService } from '../../services/incidents-services.service';
import { AuthService } from '../../../../modules/auth/services/auth.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Input() profileMenu = false;
  @Output() profileMenuOutput = new EventEmitter<boolean>();
  firstName = '';
  lastName = '';
  role = '';
  userid ='';
  incidents: any;
  displayedColumns: string[] = ['Location', 'Description', 'Date Logged', 'Actions'];
  dataSourceOpen: Incidents[] = [];
  dataSourceClosed: Incidents[] = [];

  
  constructor(
    private incidentService: IncidentsServicesService,
    private router: Router,
    private authService: AuthService){
    }


  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents() {
    this.authService.User.subscribe(authState => {
      if (authState) {
        this.userid = authState.id;
      } else {
        this.userid = '';
      }
    });
    this.incidentService.getIncidents(this.userid).subscribe( element => {
      console.log(element);
      const open: Incidents[] = [];
      const closed: Incidents[] = [];
      element.forEach(element => {
        if (element.statusId === 0  || element.statusId === 5) {
          open.push(element);
        } else if (element.incidentStatus.status_Description === 'Closed') {
          closed.push(element);
        }
      });
      this.dataSourceOpen = open;
      this.dataSourceClosed = closed;
      this.incidents = element;
    });
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/incident-edit', {id: id}]);
  }

  

}
