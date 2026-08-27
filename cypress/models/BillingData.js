class BillingData {
    constructor({
        tipoDocumento,
        firstName,
        lastName,
        gender,
        email,
        phone,
        countryCode,
        state,
        city,
        address,
        postcode
    }) {
        this.tipoDocumento = tipoDocumento;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.countryCode = countryCode;
        this.state = state;
        this.city = city;
        this.address = address;
        this.postcode = postcode;
    }
}

export default BillingData;
