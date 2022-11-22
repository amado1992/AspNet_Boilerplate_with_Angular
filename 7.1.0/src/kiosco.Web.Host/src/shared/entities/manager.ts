export class ManagerDto {

    id: any = 0
    jobId: any
    clubId: any

    //personal information
    firstName: any = ""
    lastName: any = ""
    ssn: any = ""
    address: any = ""
    address2: any = ""
    city: any = ""
    state: any = ""
    dlState: any = ""
    dlNumber: any = ""
    zipCode: any = ""
    mobilePhone: any = "" 
    homePhone: any = ""
    email: any = ""
    dob: any

    //new fields
    dateHired: any //Date
    categoryId: any //number
    //end new fields


    constructor() {
    }
}  