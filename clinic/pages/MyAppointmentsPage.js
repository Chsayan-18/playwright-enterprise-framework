export class MyAppointmentsPage {
    constructor (page) {
        this.page = page;
    }

    appointmentCard (patientName) {
        return this.page
            .getByTestId(/^clinic-appt-appt-/)
            .filter({hasText: `Patient: ${patientName}`});
    }
}