import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Incident } from 'src/app/core/models/incident.model';
import { AcceptDialogDataResult, AcceptRejectDialogComponent } from '../../components/accept-reject-dialog/accept-reject-dialog.component';
import { IncidentService } from '../../services/incident.service';

@Component({
  templateUrl: './view-assigned-incidents.component.html',
  styleUrls: ['./view-assigned-incidents.component.css']
})
export class ViewAssignedIncidentsComponent implements OnInit {

  displayedColumns: string[] = ['Incident ID', 'Location', 'Description', 'Date Logged', 'Status', 'User', 'Actions'];
  dataSourceOpen: Incident[] = [];
  dataSourceClosed: Incident[] = [];

  constructor(
    public dialog: MatDialog,
    private incidentService: IncidentService) { }

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe( incidents => {
      const open: Incident[] = [];
      const closed: Incident[] = [];
      incidents.forEach(element => {
        if (element.incidentStatus.status_ID === 0  || element.incidentStatus.status_ID === 5) {
          open.push(element);
        } else if (element.incidentStatus.status_Description === 'Closed') {
          closed.push(element);
        }
      });
      this.dataSourceOpen = open;
      this.dataSourceClosed = closed;
    });
  }

  refresh(): void {
    this.incidentService.getIncidents().subscribe( incidents => {
      const open: Incident[] = [];
      const closed: Incident[] = [];
      incidents.forEach(element => {
        if (element.incidentStatus.status_ID === 0  || element.incidentStatus.status_ID === 5) {
          open.push(element);
        } else if (element.incidentStatus.status_Description === 'Closed') {
          closed.push(element);
        }
      });
      this.dataSourceOpen = open;
      this.dataSourceClosed = closed;
    });
  }

  acceptRejectIncident(incident: Incident, acceptReject: boolean): void {
    const dialogRef = this.dialog.open(AcceptRejectDialogComponent, {
      width: '500px',
      data: {acceptReject, incident}
    });

    dialogRef.afterClosed().subscribe((result: AcceptDialogDataResult) => {

      if (result != null) {
        if (result.acceptReject) {
          this.incidentService.acceptRejectIncident(incident, true, 'null').subscribe(
            observer => {
              console.log(observer);
              this.refresh();
            }
          );

        } else {
          this.incidentService.acceptRejectIncident(incident, false, result.reason).subscribe(
            observer => {
              console.log(observer);
              this.refresh();
            }
          );

        }
      }
    });
  }

  closeIncident(incident: Incident): void {
    this.incidentService.closeIncident(incident).subscribe(
      observer => {
        console.log(observer);
        this.refresh();
      }
    );
  }

  // rejectIncident(index: number): void {
  //   this.incidentService.rejectIncident(index);
  // }

  ifStatusNotOpenAndClose(status: number): boolean {
    if (status !== 4 && status !== 5) {
      return true;
    } else {
      return false;
    }
  }
}
