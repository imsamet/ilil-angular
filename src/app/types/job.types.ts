export interface Job {
     _id: string;
     title: any;
     category: any;
     user: any;
     shortDescription: any;
     description?: any;
     files: any[];
     image?: any;
     coverImage?: any;
     video?: any;
     createdAt: string;
     location: any;
     companyName: string;
     types: string[];
     salaryType: string;
     salary: number;
     posted: boolean;
}
