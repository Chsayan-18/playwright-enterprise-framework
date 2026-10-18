import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test ("should book an appointment with valid details", async ({page}) => {
    const bookingPage = new BookingPage(page);
    
    const name = 'Sayan';

    await bookingPage.goto();

    const {weekday, day, month} = await bookingPage.selectDateByPosition(0);
    const time = await bookingPage.selectTimeByPosition(2);

    await bookingPage.fillPatientDetails(name,'9876543210');
    await bookingPage.confirmBooking();

    await expect(page.getByRole('heading', {name: 'Appointment confirmed'})).toBeVisible();
    await expect(page.getByTestId('confirmation-doctor')).toHaveText('Dr. Vikram Shah');
    await expect(page.getByText(name, {exact: true})).toBeVisible();
    await expect(page.getByTestId('confirmation-when')).toHaveText(`${weekday}, ${month} ${day} · ${time}`);
})

test ("TC_BOOK_001: empty form shows all required field errors", async ({page}) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.goto();
    await bookingPage.confirmBooking();

    await expect(bookingPage.timeError).toHaveText('Pick a time slot');
    await expect(bookingPage.nameError).toHaveText('Enter the patient name');
    await expect(bookingPage.phoneError).toHaveText('Enter a 10-digit phone number');

    await expect(bookingPage.confirmationHeading).not.toBeVisible();
})

test ("TC_BOOK_002: phone number with 9 digits is rejected", async ({page}) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.goto();
    await bookingPage.selectTimeByPosition(0);
    await bookingPage.fillPatientDetails('Sayan', '987654321');
    await bookingPage.confirmBooking();

    await expect(bookingPage.phoneError).toHaveText('Enter a 10-digit phone number');
    await expect(bookingPage.timeError).toBeHidden();
    await expect(bookingPage.nameError).toBeHidden();
    await expect(bookingPage.confirmationHeading).toBeHidden();
})