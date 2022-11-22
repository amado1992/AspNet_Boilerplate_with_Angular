export class EntertainerDto {

    id: any = 0
    //about contract
    adultPermitNum: any
    permitExpires: any
    contractExpires: any

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
    stageName: any = "" //string 
    corporateId: any = "" //string
    dateHired: any //Date
    categoryId: any //number
    hiredById: any //number
    
    //terminated contract
    noHiredById: any //number
    hiredStatuId: any //number
    terminatedHired: any //Date
    //end new fields


    constructor() {
    }
}  