export class BookingPage {
    constructor (page) {
        this.page = page;
        this.patientNameInput = page.getByRole('textbox', {name: 'Patient name'});
        this.phoneNumberInput = page.getByRole('textbox', {name: 'Phone number'});
        this.reasonSelect = page.getByLabel('Reason for visit');
        this.confirmButton = page.getByRole('button', {name: 'Confirm booking'});
        this.dateRadioGroup = page.getByRole('radiogroup', {name: 'Appointment date'});
        this.timeRadioGroup = page.getByRole('radiogroup', {name: 'Appointment time'});
        this.notesInput = page.getByLabel('Notes for the doctor (optional)');
        this.timeError = page.getByTestId('error-time');
        this.nameError = page.getByTestId('error-name');
        this.phoneError = page.getByTestId('error-phone');
        this.confirmationHeading = page.getByRole('heading', {name: 'Appointment confirmed'});
        this.confirmationDoctor = page.getByTestId('confirmation-doctor');
        this.confirmationWhen = page.getByTestId('confirmation-when');
    }

    async selectDateByPosition (position) {
        const dateRadio = this.dateRadioGroup.getByRole('radio').nth(position);
        await dateRadio.check();
        const [weekday, day, month] = await dateRadio.locator('span').allTextContents();
        return {weekday, day, month};
    }

    async selectTimeByPosition (position) {
        const timeRadio = this.timeRadioGroup.getByRole('radio').nth(position);
        await timeRadio.check();
        const timeText = await timeRadio.innerText();
        return timeText;
    }

    async fillPatientDetails (name, phone) {
        await this.patientNameInput.fill(name);
        await this.phoneNumberInput.fill(phone);
    }

    async confirmBooking () {
        await this.confirmButton.click();
    }

    async goto () {
        await this.page.addInitScript(() => {
            localStorage.setItem('pqa_tour_seen_v1', '1');
        });
        await this.page.goto('/clinic/book/d-vikram-shah');
    }
}