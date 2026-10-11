import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test ('should book an appointment with valid details', async ({page}) => {
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