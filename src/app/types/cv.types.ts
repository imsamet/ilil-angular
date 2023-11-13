export interface Cv {
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
     educationHistory: any[];
     jobHistory: any[];
     types: string[];
     salaryType: string;
     expectedSalary: number;
}
