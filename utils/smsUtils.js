// Example of an HTTP client based on fetch
const httpFetchClient = {
    get: async (url, headers) => {
        const response = await fetch(url, {
            method: "GET",
            headers
        });
        return response.json();
    },
    post: async (url, body, headers) => {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });
        return response.json();
    },
    delete: async (url, headers) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers
        });
        return response.json();
    }
};

// Format phone number with country code (using regular expressions)
function formatPhoneNumber(localNumber) {
    const countryCode = '+265'; 
    const cleanedNumber = localNumber.replace(/\D/g, '');
    const localPart = cleanedNumber.length > 9 ? cleanedNumber.slice(-9) : cleanedNumber;
    return countryCode + localPart;
}

// Send Parcel details to SMS using Android SMS Gateway
async function sendParcelDetailsSms(tracking_number, sender_name, recipient_name, recipient_phone, parcel_name, source, destination, status, date) {
    try {
        const { default: Client } = await import('android-sms-gateway');
        const apiClient = new Client('OER2VW', 'ag6fhxwj_gsnxq', httpFetchClient);

        const formattedRecipientPhone = formatPhoneNumber(recipient_phone);
        const message = {
            phoneNumbers: [formattedRecipientPhone],
            message: `KABVALO COURIERS\nYour Parcel Details Are:\nTracking Number: ${tracking_number}\nSender: ${sender_name}\nRecipient: ${recipient_name}\nPackage Name: ${parcel_name}\nSource: ${source}\nDestination: ${destination}\nStatus: ${status}\nDate: ${date}\n\nType "LOCATION: ${tracking_number}" to get the location of your parcel.\n\nThank you for using our service!`
        };

        const messageState = await apiClient.send(message);
        console.log('SMS sent successfully:', messageState);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

// Send Location SMS
async function sendLocationSms(recipientPhone, locationName) {
    try {
        const { default: Client } = await import('android-sms-gateway');
        const apiClient = new Client('OER2VW', 'ag6fhxwj_gsnxq', httpFetchClient);

        const formattedRecipientPhone = formatPhoneNumber(recipientPhone);
        const message = {
            phoneNumbers: [formattedRecipientPhone],
            message: `${locationName}.`
        };

        const messageState = await apiClient.send(message);
        console.log('Response SMS sent successfully:', messageState);
    } catch (error) {
        console.error('Error sending response SMS:', error);
    }
}

// Register the webhook
async function registerWebhook() {
    try {
        const { default: fetch } = await import('node-fetch');
        
        const url = 'https://sms.capcom.me/api/3rdparty/v1/webhooks';
        const username = 'OER2VW';
        const password = 'ag6fhxwj_gsnxq';
        const uniqueId = '5474bfda-1813-4b84-ad03-69832a862949';
        const webhookUrl = 'https://webhook.site/5474bfda-1813-4b84-ad03-69832a862949';
        const event = 'sms:received';
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        };
    
        const body = JSON.stringify({
            id: uniqueId,
            url: webhookUrl,
            event: event
        });
    
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Webhook registered successfully:', jsonResponse);
        } else {
            console.error('Failed to register webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

async function deregisterWebhook() {
    try {
        const { default: fetch } = await import('node-fetch');
        
        const url = 'https://sms.capcom.me/api/3rdparty/v1/webhooks';
        const username = 'OER2VW';
        const password = 'ag6fhxwj_gsnxq';
        const uniqueId = '9aa44110-54f1-4cf7-a3a7-61c50c8e27c9'; // Replace with the webhook ID you want to deregister

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        };

        const response = await fetch(`${url}/${uniqueId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok) {
            console.log('Webhook de-registered successfully');
        } else {
            console.error('Failed to de-register webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// deregisterWebhook();
registerWebhook();

// Export functions
module.exports = { sendParcelDetailsSms, sendLocationSms, registerWebhook, deregisterWebhook };