import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';
import { MyAppointmentsPage } from '../pages/MyAppointmentsPage';

let bookingPage;

test.beforeEach(async ({page}) => {
    bookingPage = new BookingPage(page);
    await bookingPage.goto();
})

test ("should book an appointment with valid details", async ({page}) => {
    
    const name = 'Sayan';
    const phone = '9876543210';

    const {weekday, day, month} = await bookingPage.selectDateByPosition(0);
    const time = await bookingPage.selectTimeByPosition(2);

    await bookingPage.fillPatientDetails(name,phone);
    await bookingPage.confirmBooking();

    await expect(bookingPage.confirmationHeading).toBeVisible();
    await expect(bookingPage.confirmationDoctor).toHaveText('Dr. Vikram Shah');
    await expect(page.getByText(name, {exact: true})).toBeVisible();
    await expect(bookingPage.confirmationWhen).toHaveText(`${weekday}, ${month} ${day} · ${time}`);
})

test ("TC_BOOK_001: empty form shows all required field errors", async () => {
    await bookingPage.confirmBooking();

    await expect(bookingPage.timeError).toHaveText('Pick a time slot');
    await expect(bookingPage.nameError).toHaveText('Enter the patient name');
    await expect(bookingPage.phoneError).toHaveText('Enter a 10-digit phone number');

    await expect(bookingPage.confirmationHeading).toBeHidden();
})

test ("TC_BOOK_002: phone number with 9 digits is rejected", async () => {
    await bookingPage.selectTimeByPosition(0);
    await bookingPage.fillPatientDetails('Sayan', '987654321');
    await bookingPage.confirmBooking();

    await expect(bookingPage.phoneError).toHaveText('Enter a 10-digit phone number');
    await expect(bookingPage.timeError).toBeHidden();
    await expect(bookingPage.nameError).toBeHidden();
    await expect(bookingPage.confirmationHeading).toBeHidden();
})

test ("TC_BOOK_004: User recovers from validation errors and completes the booking", async ({page}) => {
    const name = 'Sayan';
    const phone = '9876543210';
    
    await bookingPage.confirmBooking();

    await expect(bookingPage.timeError).toHaveText('Pick a time slot');
    await expect(bookingPage.nameError).toHaveText('Enter the patient name');
    await expect(bookingPage.phoneError).toHaveText('Enter a 10-digit phone number');
    await expect(bookingPage.confirmButton).toBeEnabled();
    await expect(bookingPage.confirmationHeading).toBeHidden();

    const {weekday, day, month} = await bookingPage.selectDateByPosition(0);
    const time = await bookingPage.selectTimeByPosition(0);
    await bookingPage.fillPatientDetails(name, phone);
    await bookingPage.confirmBooking();

    await expect(bookingPage.confirmationHeading).toBeVisible();

    await expect(bookingPage.timeError).toBeHidden();
    await expect(bookingPage.nameError).toBeHidden();
    await expect(bookingPage.phoneError).toBeHidden();

    await expect(bookingPage.confirmationWhen).toHaveText(`${weekday}, ${month} ${day} · ${time}`);
    await expect(page.getByText(name, {exact: true})).toBeVisible();
    await expect(bookingPage.confirmationDoctor).toHaveText('Dr. Vikram Shah');
})

test ("TC_BOOK_005: booking with reason and notes appears in My appointments", async ({page}) => {
    await bookingPage.selectTimeByPosition(0);
    await bookingPage.fillPatientDetails('Sayan 005', '9876543210');
    await bookingPage.reasonSelect.selectOption({label: 'Follow-up visit'});
    await bookingPage.notesInput.fill('TC_BOOK_005 notes');
    await bookingPage.confirmBooking();

    await expect(bookingPage.confirmationHeading).toBeVisible();
    await expect(bookingPage.confirmationDoctor).toHaveText('Dr. Vikram Shah');
    await expect(page.getByText('Sayan 005', {exact: true})).toBeVisible();
    await expect(bookingPage.viewMyAppointmentsButton).toBeVisible();

    await bookingPage.viewMyAppointments();

    const myAppointmentsPage = new MyAppointmentsPage(page);
    const card = myAppointmentsPage.appointmentCard('Sayan 005');
    const reason = 'Follow-up visit';
    await expect(card).toBeVisible();
    await expect(card).toContainText(`Reason: ${reason}`);
    await expect(card.locator('.clinic-appt-card-notes')).toContainText('TC_BOOK_005 notes');
})